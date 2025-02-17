from uuid import UUID

from authlib.integrations.sqla_oauth2 import OAuth2AuthorizationCodeMixin
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, declared_attr, mapped_column, relationship

from polar.kit.db.models import RecordModel
from polar.kit.extensions.sqlalchemy import PostgresUUID
from polar.models.user import User


class OAuth2AuthorizationCode(RecordModel, OAuth2AuthorizationCodeMixin):
    __tablename__ = "oauth2_authorization_codes"

    user_id: Mapped[UUID] = mapped_column(
        PostgresUUID, ForeignKey("users.id", ondelete="cascade"), nullable=False
    )

    @declared_attr
    def user(cls) -> Mapped[User]:
        return relationship(User, lazy="joined")
