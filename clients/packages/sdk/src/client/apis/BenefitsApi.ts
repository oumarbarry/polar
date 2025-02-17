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
  BenefitCreate,
  BenefitType,
  BenefitUpdate,
  HTTPValidationError,
  ListResourceUnionBenefitArticlesBenefitAdsBenefitCustomBenefitDiscordBenefitGitHubRepository,
  Platforms,
  ResponseBenefitsCreateBenefit,
  ResponseBenefitsLookupBenefit,
  ResponseBenefitsUpdateBenefit,
} from '../models/index';

export interface BenefitsApiCreateBenefitRequest {
    benefitCreate: BenefitCreate;
}

export interface BenefitsApiDeleteBenefitRequest {
    id: string;
}

export interface BenefitsApiLookupBenefitRequest {
    benefitId: string;
}

export interface BenefitsApiSearchBenefitsRequest {
    organizationName: string;
    platform: Platforms;
    repositoryName?: string;
    directOrganization?: boolean;
    type?: BenefitType;
    page?: number;
    limit?: number;
}

export interface BenefitsApiUpdateBenefitRequest {
    id: string;
    benefitUpdate: BenefitUpdate;
}

/**
 * 
 */
export class BenefitsApi extends runtime.BaseAPI {

    /**
     * Create Benefit
     */
    async createBenefitRaw(requestParameters: BenefitsApiCreateBenefitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseBenefitsCreateBenefit>> {
        if (requestParameters['benefitCreate'] == null) {
            throw new runtime.RequiredError(
                'benefitCreate',
                'Required parameter "benefitCreate" was null or undefined when calling createBenefit().'
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
            path: `/api/v1/benefits/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['benefitCreate'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Create Benefit
     */
    async createBenefit(requestParameters: BenefitsApiCreateBenefitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseBenefitsCreateBenefit> {
        const response = await this.createBenefitRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete Benefit
     */
    async deleteBenefitRaw(requestParameters: BenefitsApiDeleteBenefitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deleteBenefit().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/benefits/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete Benefit
     */
    async deleteBenefit(requestParameters: BenefitsApiDeleteBenefitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteBenefitRaw(requestParameters, initOverrides);
    }

    /**
     * Lookup Benefit
     */
    async lookupBenefitRaw(requestParameters: BenefitsApiLookupBenefitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseBenefitsLookupBenefit>> {
        if (requestParameters['benefitId'] == null) {
            throw new runtime.RequiredError(
                'benefitId',
                'Required parameter "benefitId" was null or undefined when calling lookupBenefit().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['benefitId'] != null) {
            queryParameters['benefit_id'] = requestParameters['benefitId'];
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
            path: `/api/v1/benefits/lookup`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Lookup Benefit
     */
    async lookupBenefit(requestParameters: BenefitsApiLookupBenefitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseBenefitsLookupBenefit> {
        const response = await this.lookupBenefitRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Search Benefits
     */
    async searchBenefitsRaw(requestParameters: BenefitsApiSearchBenefitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListResourceUnionBenefitArticlesBenefitAdsBenefitCustomBenefitDiscordBenefitGitHubRepository>> {
        if (requestParameters['organizationName'] == null) {
            throw new runtime.RequiredError(
                'organizationName',
                'Required parameter "organizationName" was null or undefined when calling searchBenefits().'
            );
        }

        if (requestParameters['platform'] == null) {
            throw new runtime.RequiredError(
                'platform',
                'Required parameter "platform" was null or undefined when calling searchBenefits().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['repositoryName'] != null) {
            queryParameters['repository_name'] = requestParameters['repositoryName'];
        }

        if (requestParameters['directOrganization'] != null) {
            queryParameters['direct_organization'] = requestParameters['directOrganization'];
        }

        if (requestParameters['type'] != null) {
            queryParameters['type'] = requestParameters['type'];
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
            path: `/api/v1/benefits/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Search Benefits
     */
    async searchBenefits(requestParameters: BenefitsApiSearchBenefitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListResourceUnionBenefitArticlesBenefitAdsBenefitCustomBenefitDiscordBenefitGitHubRepository> {
        const response = await this.searchBenefitsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update Benefit
     */
    async updateBenefitRaw(requestParameters: BenefitsApiUpdateBenefitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseBenefitsUpdateBenefit>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling updateBenefit().'
            );
        }

        if (requestParameters['benefitUpdate'] == null) {
            throw new runtime.RequiredError(
                'benefitUpdate',
                'Required parameter "benefitUpdate" was null or undefined when calling updateBenefit().'
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
            path: `/api/v1/benefits/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['benefitUpdate'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Update Benefit
     */
    async updateBenefit(requestParameters: BenefitsApiUpdateBenefitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseBenefitsUpdateBenefit> {
        const response = await this.updateBenefitRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
