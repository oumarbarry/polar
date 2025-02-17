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
  HTTPValidationError,
  IssueFunding,
  ListFundingSortBy,
  ListResourceIssueFunding,
  Platforms,
} from '../models/index';

export interface FundingApiLookupRequest {
    issueId: string;
}

export interface FundingApiSearchRequest {
    organizationName: string;
    platform: Platforms;
    repositoryName?: string;
    query?: string;
    badged?: boolean;
    closed?: boolean;
    sorting?: Array<ListFundingSortBy>;
    page?: number;
    limit?: number;
}

/**
 * 
 */
export class FundingApi extends runtime.BaseAPI {

    /**
     * Lookup
     */
    async lookupRaw(requestParameters: FundingApiLookupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueFunding>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling lookup().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['issueId'] != null) {
            queryParameters['issue_id'] = requestParameters['issueId'];
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
            path: `/api/v1/funding/lookup`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Lookup
     */
    async lookup(requestParameters: FundingApiLookupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueFunding> {
        const response = await this.lookupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Search
     */
    async searchRaw(requestParameters: FundingApiSearchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListResourceIssueFunding>> {
        if (requestParameters['organizationName'] == null) {
            throw new runtime.RequiredError(
                'organizationName',
                'Required parameter "organizationName" was null or undefined when calling search().'
            );
        }

        if (requestParameters['platform'] == null) {
            throw new runtime.RequiredError(
                'platform',
                'Required parameter "platform" was null or undefined when calling search().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['repositoryName'] != null) {
            queryParameters['repository_name'] = requestParameters['repositoryName'];
        }

        if (requestParameters['query'] != null) {
            queryParameters['query'] = requestParameters['query'];
        }

        if (requestParameters['badged'] != null) {
            queryParameters['badged'] = requestParameters['badged'];
        }

        if (requestParameters['closed'] != null) {
            queryParameters['closed'] = requestParameters['closed'];
        }

        if (requestParameters['sorting'] != null) {
            queryParameters['sorting'] = requestParameters['sorting'];
        }

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

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/funding/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Search
     */
    async search(requestParameters: FundingApiSearchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListResourceIssueFunding> {
        const response = await this.searchRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
