/* tslint:disable */
/* eslint-disable */
/**
 * Polar API
 *  Welcome to the **Polar API** for [polar.sh](https://polar.sh).  The Public API is currently a [work in progress](https://github.com/polarsource/polar/issues/834) and is in active development. 🚀  #### Authentication  Use a [Personal Access Token](https://polar.sh/settings) and send it in the `Authorization` header on the format `Bearer [YOUR_TOKEN]`.  #### Feedback  If you have any feedback or comments, reach out in the [Polar API-issue](https://github.com/polarsource/polar/issues/834), or reach out on the Polar Discord server.  We\'d love to see what you\'ve built with the API and to get your thoughts on how we can make the API better!  #### Connecting  The Polar API is online at `https://api.polar.sh`. 
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  DonationCreateStripePaymentIntent,
  DonationStatistics,
  DonationStripePaymentIntentMutationResponse,
  DonationUpdateStripePaymentIntent,
  HTTPValidationError,
  ListResourceDonation,
  ListResourcePublicDonation,
  Platforms,
} from '../models/index';

export interface DonationsApiCreatePaymentIntentRequest {
    donationCreateStripePaymentIntent: DonationCreateStripePaymentIntent;
}

export interface DonationsApiDonationsPublicSearchRequest {
    organizationName: string;
    platform: Platforms;
    page?: number;
    limit?: number;
    sorting?: Array<string>;
}

export interface DonationsApiSearchDonationsRequest {
    toOrganizationId: string;
    page?: number;
    limit?: number;
    sorting?: Array<string>;
}

export interface DonationsApiStatisticsRequest {
    toOrganizationId: string;
    startDate: string;
    endDate: string;
    donationsInterval: StatisticsDonationsIntervalEnum;
}

export interface DonationsApiUpdatePaymentIntentRequest {
    id: string;
    donationUpdateStripePaymentIntent: DonationUpdateStripePaymentIntent;
}

/**
 * 
 */
export class DonationsApi extends runtime.BaseAPI {

    /**
     * Create Payment Intent
     */
    async createPaymentIntentRaw(requestParameters: DonationsApiCreatePaymentIntentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DonationStripePaymentIntentMutationResponse>> {
        if (requestParameters['donationCreateStripePaymentIntent'] == null) {
            throw new runtime.RequiredError(
                'donationCreateStripePaymentIntent',
                'Required parameter "donationCreateStripePaymentIntent" was null or undefined when calling createPaymentIntent().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/donations/payment_intent`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['donationCreateStripePaymentIntent'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Create Payment Intent
     */
    async createPaymentIntent(requestParameters: DonationsApiCreatePaymentIntentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DonationStripePaymentIntentMutationResponse> {
        const response = await this.createPaymentIntentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Donations Public Search
     */
    async donationsPublicSearchRaw(requestParameters: DonationsApiDonationsPublicSearchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListResourcePublicDonation>> {
        if (requestParameters['organizationName'] == null) {
            throw new runtime.RequiredError(
                'organizationName',
                'Required parameter "organizationName" was null or undefined when calling donationsPublicSearch().'
            );
        }

        if (requestParameters['platform'] == null) {
            throw new runtime.RequiredError(
                'platform',
                'Required parameter "platform" was null or undefined when calling donationsPublicSearch().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['organizationName'] != null) {
            queryParameters['organization_name'] = requestParameters['organizationName'];
        }

        if (requestParameters['platform'] != null) {
            queryParameters['platform'] = requestParameters['platform'];
        }

        if (requestParameters['sorting'] != null) {
            queryParameters['sorting'] = requestParameters['sorting'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/donations/public/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Donations Public Search
     */
    async donationsPublicSearch(requestParameters: DonationsApiDonationsPublicSearchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListResourcePublicDonation> {
        const response = await this.donationsPublicSearchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Search Donations
     */
    async searchDonationsRaw(requestParameters: DonationsApiSearchDonationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListResourceDonation>> {
        if (requestParameters['toOrganizationId'] == null) {
            throw new runtime.RequiredError(
                'toOrganizationId',
                'Required parameter "toOrganizationId" was null or undefined when calling searchDonations().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['toOrganizationId'] != null) {
            queryParameters['to_organization_id'] = requestParameters['toOrganizationId'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['sorting'] != null) {
            queryParameters['sorting'] = requestParameters['sorting'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/donations/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Search Donations
     */
    async searchDonations(requestParameters: DonationsApiSearchDonationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListResourceDonation> {
        const response = await this.searchDonationsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Statistics
     */
    async statisticsRaw(requestParameters: DonationsApiStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DonationStatistics>> {
        if (requestParameters['toOrganizationId'] == null) {
            throw new runtime.RequiredError(
                'toOrganizationId',
                'Required parameter "toOrganizationId" was null or undefined when calling statistics().'
            );
        }

        if (requestParameters['startDate'] == null) {
            throw new runtime.RequiredError(
                'startDate',
                'Required parameter "startDate" was null or undefined when calling statistics().'
            );
        }

        if (requestParameters['endDate'] == null) {
            throw new runtime.RequiredError(
                'endDate',
                'Required parameter "endDate" was null or undefined when calling statistics().'
            );
        }

        if (requestParameters['donationsInterval'] == null) {
            throw new runtime.RequiredError(
                'donationsInterval',
                'Required parameter "donationsInterval" was null or undefined when calling statistics().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['toOrganizationId'] != null) {
            queryParameters['to_organization_id'] = requestParameters['toOrganizationId'];
        }

        if (requestParameters['startDate'] != null) {
            queryParameters['start_date'] = requestParameters['startDate'];
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['end_date'] = requestParameters['endDate'];
        }

        if (requestParameters['donationsInterval'] != null) {
            queryParameters['donationsInterval'] = requestParameters['donationsInterval'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/donations/statistics`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Statistics
     */
    async statistics(requestParameters: DonationsApiStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DonationStatistics> {
        const response = await this.statisticsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update Payment Intent
     */
    async updatePaymentIntentRaw(requestParameters: DonationsApiUpdatePaymentIntentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DonationStripePaymentIntentMutationResponse>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling updatePaymentIntent().'
            );
        }

        if (requestParameters['donationUpdateStripePaymentIntent'] == null) {
            throw new runtime.RequiredError(
                'donationUpdateStripePaymentIntent',
                'Required parameter "donationUpdateStripePaymentIntent" was null or undefined when calling updatePaymentIntent().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/donations/payment_intent/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['donationUpdateStripePaymentIntent'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Update Payment Intent
     */
    async updatePaymentIntent(requestParameters: DonationsApiUpdatePaymentIntentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DonationStripePaymentIntentMutationResponse> {
        const response = await this.updatePaymentIntentRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const StatisticsDonationsIntervalEnum = {
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day'
} as const;
export type StatisticsDonationsIntervalEnum = typeof StatisticsDonationsIntervalEnum[keyof typeof StatisticsDonationsIntervalEnum];
