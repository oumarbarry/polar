import math
from typing import Literal

from polar.integrations.stripe.service import stripe as stripe_service
from polar.integrations.stripe.utils import get_expandable_id
from polar.models import Transaction
from polar.models.transaction import FeeType, PaymentProcessor, TransactionType
from polar.postgres import AsyncSession

from .base import BaseTransactionService, BaseTransactionServiceError


def _round_stripe(amount: float) -> int:
    return math.ceil(amount) if amount - int(amount) >= 0.5 else math.floor(amount)


def _get_stripe_subscription_fee(amount: int) -> int:
    return _round_stripe(amount * 0.005)


def _get_stripe_tax_fee(amount: int) -> int:
    return _round_stripe(amount * 0.005)


class FeeTransactionError(BaseTransactionServiceError):
    ...


class FeeTransactionService(BaseTransactionService):
    async def create_payment_fees(
        self, session: AsyncSession, *, payment_transaction: Transaction
    ) -> list[Transaction]:
        fee_transactions: list[Transaction] = []

        if payment_transaction.processor != PaymentProcessor.stripe:
            return fee_transactions

        if payment_transaction.charge_id is None:
            return fee_transactions

        charge = stripe_service.get_charge(payment_transaction.charge_id)

        # Payment fee
        if charge.balance_transaction:
            stripe_balance_transaction = stripe_service.get_balance_transaction(
                get_expandable_id(charge.balance_transaction)
            )
            payment_fee_transaction = Transaction(
                type=TransactionType.fee,
                processor=PaymentProcessor.stripe,
                fee_type=FeeType.payment,
                currency=payment_transaction.currency,
                amount=-stripe_balance_transaction.fee,
                account_currency=payment_transaction.currency,
                account_amount=-stripe_balance_transaction.fee,
                tax_amount=0,
                incurred_by_transaction_id=payment_transaction.id,
            )
            session.add(payment_fee_transaction)
            fee_transactions.append(payment_fee_transaction)

        if charge.invoice is not None:
            invoice = stripe_service.get_invoice(get_expandable_id(charge.invoice))
            if invoice.subscription is not None:
                subscription = stripe_service.get_subscription(
                    get_expandable_id(invoice.subscription)
                )

                # Subscription fee
                fee_amount = _get_stripe_subscription_fee(payment_transaction.amount)
                subscription_fee_transaction = Transaction(
                    type=TransactionType.fee,
                    processor=PaymentProcessor.stripe,
                    fee_type=FeeType.subscription,
                    currency=payment_transaction.currency,
                    amount=-fee_amount,
                    account_currency=payment_transaction.currency,
                    account_amount=-fee_amount,
                    tax_amount=0,
                    incurred_by_transaction_id=payment_transaction.id,
                )
                session.add(subscription_fee_transaction)
                fee_transactions.append(subscription_fee_transaction)

                # Tax fee
                if subscription.automatic_tax.enabled:
                    fee_amount = _get_stripe_tax_fee(payment_transaction.amount)
                    tax_fee_transaction = Transaction(
                        type=TransactionType.fee,
                        processor=PaymentProcessor.stripe,
                        fee_type=FeeType.tax,
                        currency=payment_transaction.currency,
                        amount=-fee_amount,
                        account_currency=payment_transaction.currency,
                        account_amount=-fee_amount,
                        tax_amount=0,
                        incurred_by_transaction_id=payment_transaction.id,
                    )
                    session.add(tax_fee_transaction)
                    fee_transactions.append(tax_fee_transaction)

        await session.commit()

        return fee_transactions

    async def create_refund_fees(
        self,
        session: AsyncSession,
        *,
        refund_transaction: Transaction,
    ) -> list[Transaction]:
        fee_transactions: list[Transaction] = []

        if refund_transaction.processor != PaymentProcessor.stripe:
            return fee_transactions

        if refund_transaction.refund_id is None:
            return fee_transactions

        refund = stripe_service.get_refund(refund_transaction.refund_id)

        if refund.balance_transaction is None:
            return fee_transactions

        balance_transaction = stripe_service.get_balance_transaction(
            get_expandable_id(refund.balance_transaction)
        )

        refund_fee_transaction = Transaction(
            type=TransactionType.fee,
            processor=PaymentProcessor.stripe,
            fee_type=FeeType.refund,
            currency=refund_transaction.currency,
            amount=-balance_transaction.fee,
            account_currency=refund_transaction.currency,
            account_amount=-balance_transaction.fee,
            tax_amount=0,
            incurred_by_transaction_id=refund_transaction.id,
        )

        session.add(refund_fee_transaction)
        fee_transactions.append(refund_fee_transaction)

        await session.commit()

        return fee_transactions

    async def create_dispute_fees(
        self,
        session: AsyncSession,
        *,
        dispute_transaction: Transaction,
        category: Literal["dispute", "dispute_reversal"],
    ) -> list[Transaction]:
        fee_transactions: list[Transaction] = []

        if dispute_transaction.processor != PaymentProcessor.stripe:
            return fee_transactions

        if dispute_transaction.dispute_id is None:
            return fee_transactions

        dispute = stripe_service.get_dispute(dispute_transaction.dispute_id)
        balance_transaction = next(
            bt
            for bt in dispute.balance_transactions
            if bt.reporting_category == category
        )

        dispute_fee_transaction = Transaction(
            type=TransactionType.fee,
            processor=PaymentProcessor.stripe,
            fee_type=FeeType.dispute,
            currency=dispute_transaction.currency,
            amount=-balance_transaction.fee,
            account_currency=dispute_transaction.currency,
            account_amount=-balance_transaction.fee,
            tax_amount=0,
            incurred_by_transaction_id=dispute_transaction.id,
        )

        session.add(dispute_fee_transaction)
        fee_transactions.append(dispute_fee_transaction)

        await session.commit()

        return fee_transactions


fee_transaction = FeeTransactionService(Transaction)
