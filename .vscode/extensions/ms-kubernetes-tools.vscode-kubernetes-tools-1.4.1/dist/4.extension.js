"use strict";
exports.id = 4;
exports.ids = [4];
exports.modules = {

/***/ 2183
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * This error is thrown when an asynchronous operation has been aborted.
 * Check for this error by testing the `name` that the name property of the
 * error matches `"AbortError"`.
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 * controller.abort();
 * try {
 *   doAsyncWork(controller.signal)
 * } catch (e) {
 *   if (e.name === 'AbortError') {
 *     // handle abort error here.
 *   }
 * }
 * ```
 */
class AbortError extends Error {
    constructor(message) {
        super(message);
        this.name = "AbortError";
    }
}
//# sourceMappingURL=AbortError.js.map

/***/ },

/***/ 2182
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* reexport safe */ _AbortError_js__WEBPACK_IMPORTED_MODULE_0__.AbortError)
/* harmony export */ });
/* harmony import */ var _AbortError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2183);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

//# sourceMappingURL=index.js.map

/***/ },

/***/ 2174
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_RETRY_POLICY_COUNT: () => (/* binding */ DEFAULT_RETRY_POLICY_COUNT),
/* harmony export */   SDK_VERSION: () => (/* binding */ SDK_VERSION)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const SDK_VERSION = "1.22.2";
const DEFAULT_RETRY_POLICY_COUNT = 3;
//# sourceMappingURL=constants.js.map

/***/ },

/***/ 2161
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPipelineFromOptions: () => (/* binding */ createPipelineFromOptions)
/* harmony export */ });
/* harmony import */ var _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2162);
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2103);
/* harmony import */ var _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2170);
/* harmony import */ var _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2171);
/* harmony import */ var _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2175);
/* harmony import */ var _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2187);
/* harmony import */ var _policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2188);
/* harmony import */ var _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2189);
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2177);
/* harmony import */ var _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2190);
/* harmony import */ var _policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2191);
/* harmony import */ var _policies_agentPolicy_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2192);
/* harmony import */ var _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(2193);
/* harmony import */ var _policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(2194);
/* harmony import */ var _policies_wrapAbortSignalLikePolicy_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(2201);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.















/**
 * Create a new pipeline with a default set of customizable policies.
 * @param options - Options to configure a custom pipeline.
 */
function createPipelineFromOptions(options) {
    const pipeline = (0,_pipeline_js__WEBPACK_IMPORTED_MODULE_1__.createEmptyPipeline)();
    if (_azure_core_util__WEBPACK_IMPORTED_MODULE_8__.isNodeLike) {
        if (options.agent) {
            pipeline.addPolicy((0,_policies_agentPolicy_js__WEBPACK_IMPORTED_MODULE_11__.agentPolicy)(options.agent));
        }
        if (options.tlsOptions) {
            pipeline.addPolicy((0,_policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_12__.tlsPolicy)(options.tlsOptions));
        }
        pipeline.addPolicy((0,_policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_9__.proxyPolicy)(options.proxyOptions));
        pipeline.addPolicy((0,_policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_5__.decompressResponsePolicy)());
    }
    pipeline.addPolicy((0,_policies_wrapAbortSignalLikePolicy_js__WEBPACK_IMPORTED_MODULE_14__.wrapAbortSignalLikePolicy)());
    pipeline.addPolicy((0,_policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_7__.formDataPolicy)(), { beforePolicies: [_policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_4__.multipartPolicyName] });
    pipeline.addPolicy((0,_policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_3__.userAgentPolicy)(options.userAgentOptions));
    pipeline.addPolicy((0,_policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_10__.setClientRequestIdPolicy)(options.telemetryOptions?.clientRequestIdHeaderName));
    // The multipart policy is added after policies with no phase, so that
    // policies can be added between it and formDataPolicy to modify
    // properties (e.g., making the boundary constant in recorded tests).
    pipeline.addPolicy((0,_policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_4__.multipartPolicy)(), { afterPhase: "Deserialize" });
    pipeline.addPolicy((0,_policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_6__.defaultRetryPolicy)(options.retryOptions), { phase: "Retry" });
    pipeline.addPolicy((0,_policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_13__.tracingPolicy)({ ...options.userAgentOptions, ...options.loggingOptions }), {
        afterPhase: "Retry",
    });
    if (_azure_core_util__WEBPACK_IMPORTED_MODULE_8__.isNodeLike) {
        // Both XHR and Fetch expect to handle redirects automatically,
        // so only include this policy when we're in Node.
        pipeline.addPolicy((0,_policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_2__.redirectPolicy)(options.redirectOptions), { afterPhase: "Retry" });
    }
    pipeline.addPolicy((0,_policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_0__.logPolicy)(options.loggingOptions), { afterPhase: "Sign" });
    return pipeline;
}
//# sourceMappingURL=createPipelineFromOptions.js.map

/***/ },

/***/ 2203
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDefaultHttpClient: () => (/* binding */ createDefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2104);
/* harmony import */ var _util_wrapAbortSignal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2202);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * Create the correct HttpClient for the current environment.
 */
function createDefaultHttpClient() {
    const client = (0,_typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__.createDefaultHttpClient)();
    return {
        async sendRequest(request) {
            // we wrap any AbortSignalLike here since the TypeSpec runtime expects a native AbortSignal.
            // 99% of the time, this should be a no-op since a native AbortSignal is passed in.
            const { abortSignal, cleanup } = request.abortSignal
                ? (0,_util_wrapAbortSignal_js__WEBPACK_IMPORTED_MODULE_1__.wrapAbortSignalLike)(request.abortSignal)
                : {};
            try {
                request.abortSignal = abortSignal;
                return await client.sendRequest(request);
            }
            finally {
                cleanup?.();
            }
        },
    };
}
//# sourceMappingURL=defaultHttpClient.js.map

/***/ },

/***/ 2204
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHttpHeaders: () => (/* binding */ createHttpHeaders)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2104);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Creates an object that satisfies the `HttpHeaders` interface.
 * @param rawHeaders - A simple object representing initial headers
 */
function createHttpHeaders(rawHeaders) {
    return (0,_typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__.createHttpHeaders)(rawHeaders);
}
//# sourceMappingURL=httpHeaders.js.map

/***/ },

/***/ 2102
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RestError: () => (/* reexport safe */ _restError_js__WEBPACK_IMPORTED_MODULE_5__.RestError),
/* harmony export */   agentPolicy: () => (/* reexport safe */ _policies_agentPolicy_js__WEBPACK_IMPORTED_MODULE_24__.agentPolicy),
/* harmony export */   agentPolicyName: () => (/* reexport safe */ _policies_agentPolicy_js__WEBPACK_IMPORTED_MODULE_24__.agentPolicyName),
/* harmony export */   auxiliaryAuthenticationHeaderPolicy: () => (/* reexport safe */ _policies_auxiliaryAuthenticationHeaderPolicy_js__WEBPACK_IMPORTED_MODULE_23__.auxiliaryAuthenticationHeaderPolicy),
/* harmony export */   auxiliaryAuthenticationHeaderPolicyName: () => (/* reexport safe */ _policies_auxiliaryAuthenticationHeaderPolicy_js__WEBPACK_IMPORTED_MODULE_23__.auxiliaryAuthenticationHeaderPolicyName),
/* harmony export */   bearerTokenAuthenticationPolicy: () => (/* reexport safe */ _policies_bearerTokenAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_21__.bearerTokenAuthenticationPolicy),
/* harmony export */   bearerTokenAuthenticationPolicyName: () => (/* reexport safe */ _policies_bearerTokenAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_21__.bearerTokenAuthenticationPolicyName),
/* harmony export */   createDefaultHttpClient: () => (/* reexport safe */ _defaultHttpClient_js__WEBPACK_IMPORTED_MODULE_2__.createDefaultHttpClient),
/* harmony export */   createEmptyPipeline: () => (/* reexport safe */ _pipeline_js__WEBPACK_IMPORTED_MODULE_0__.createEmptyPipeline),
/* harmony export */   createFile: () => (/* reexport safe */ _util_file_js__WEBPACK_IMPORTED_MODULE_25__.createFile),
/* harmony export */   createFileFromStream: () => (/* reexport safe */ _util_file_js__WEBPACK_IMPORTED_MODULE_25__.createFileFromStream),
/* harmony export */   createHttpHeaders: () => (/* reexport safe */ _httpHeaders_js__WEBPACK_IMPORTED_MODULE_3__.createHttpHeaders),
/* harmony export */   createPipelineFromOptions: () => (/* reexport safe */ _createPipelineFromOptions_js__WEBPACK_IMPORTED_MODULE_1__.createPipelineFromOptions),
/* harmony export */   createPipelineRequest: () => (/* reexport safe */ _pipelineRequest_js__WEBPACK_IMPORTED_MODULE_4__.createPipelineRequest),
/* harmony export */   decompressResponsePolicy: () => (/* reexport safe */ _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_6__.decompressResponsePolicy),
/* harmony export */   decompressResponsePolicyName: () => (/* reexport safe */ _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_6__.decompressResponsePolicyName),
/* harmony export */   defaultRetryPolicy: () => (/* reexport safe */ _policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_17__.defaultRetryPolicy),
/* harmony export */   exponentialRetryPolicy: () => (/* reexport safe */ _policies_exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_7__.exponentialRetryPolicy),
/* harmony export */   exponentialRetryPolicyName: () => (/* reexport safe */ _policies_exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_7__.exponentialRetryPolicyName),
/* harmony export */   formDataPolicy: () => (/* reexport safe */ _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_20__.formDataPolicy),
/* harmony export */   formDataPolicyName: () => (/* reexport safe */ _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_20__.formDataPolicyName),
/* harmony export */   getDefaultProxySettings: () => (/* reexport safe */ _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_11__.getDefaultProxySettings),
/* harmony export */   isRestError: () => (/* reexport safe */ _restError_js__WEBPACK_IMPORTED_MODULE_5__.isRestError),
/* harmony export */   logPolicy: () => (/* reexport safe */ _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_9__.logPolicy),
/* harmony export */   logPolicyName: () => (/* reexport safe */ _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_9__.logPolicyName),
/* harmony export */   multipartPolicy: () => (/* reexport safe */ _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_10__.multipartPolicy),
/* harmony export */   multipartPolicyName: () => (/* reexport safe */ _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_10__.multipartPolicyName),
/* harmony export */   ndJsonPolicy: () => (/* reexport safe */ _policies_ndJsonPolicy_js__WEBPACK_IMPORTED_MODULE_22__.ndJsonPolicy),
/* harmony export */   ndJsonPolicyName: () => (/* reexport safe */ _policies_ndJsonPolicy_js__WEBPACK_IMPORTED_MODULE_22__.ndJsonPolicyName),
/* harmony export */   proxyPolicy: () => (/* reexport safe */ _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_11__.proxyPolicy),
/* harmony export */   proxyPolicyName: () => (/* reexport safe */ _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_11__.proxyPolicyName),
/* harmony export */   redirectPolicy: () => (/* reexport safe */ _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_12__.redirectPolicy),
/* harmony export */   redirectPolicyName: () => (/* reexport safe */ _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_12__.redirectPolicyName),
/* harmony export */   retryPolicy: () => (/* reexport safe */ _policies_retryPolicy_js__WEBPACK_IMPORTED_MODULE_15__.retryPolicy),
/* harmony export */   setClientRequestIdPolicy: () => (/* reexport safe */ _policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_8__.setClientRequestIdPolicy),
/* harmony export */   setClientRequestIdPolicyName: () => (/* reexport safe */ _policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_8__.setClientRequestIdPolicyName),
/* harmony export */   systemErrorRetryPolicy: () => (/* reexport safe */ _policies_systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_13__.systemErrorRetryPolicy),
/* harmony export */   systemErrorRetryPolicyName: () => (/* reexport safe */ _policies_systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_13__.systemErrorRetryPolicyName),
/* harmony export */   throttlingRetryPolicy: () => (/* reexport safe */ _policies_throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_14__.throttlingRetryPolicy),
/* harmony export */   throttlingRetryPolicyName: () => (/* reexport safe */ _policies_throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_14__.throttlingRetryPolicyName),
/* harmony export */   tlsPolicy: () => (/* reexport safe */ _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_19__.tlsPolicy),
/* harmony export */   tlsPolicyName: () => (/* reexport safe */ _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_19__.tlsPolicyName),
/* harmony export */   tracingPolicy: () => (/* reexport safe */ _policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_16__.tracingPolicy),
/* harmony export */   tracingPolicyName: () => (/* reexport safe */ _policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_16__.tracingPolicyName),
/* harmony export */   userAgentPolicy: () => (/* reexport safe */ _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_18__.userAgentPolicy),
/* harmony export */   userAgentPolicyName: () => (/* reexport safe */ _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_18__.userAgentPolicyName)
/* harmony export */ });
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2103);
/* harmony import */ var _createPipelineFromOptions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2161);
/* harmony import */ var _defaultHttpClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2203);
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2204);
/* harmony import */ var _pipelineRequest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2205);
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2200);
/* harmony import */ var _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2187);
/* harmony import */ var _policies_exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2206);
/* harmony import */ var _policies_setClientRequestIdPolicy_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2191);
/* harmony import */ var _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2162);
/* harmony import */ var _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2175);
/* harmony import */ var _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2190);
/* harmony import */ var _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(2170);
/* harmony import */ var _policies_systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(2207);
/* harmony import */ var _policies_throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(2208);
/* harmony import */ var _policies_retryPolicy_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(2209);
/* harmony import */ var _policies_tracingPolicy_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(2194);
/* harmony import */ var _policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(2188);
/* harmony import */ var _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(2171);
/* harmony import */ var _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(2193);
/* harmony import */ var _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(2189);
/* harmony import */ var _policies_bearerTokenAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(2210);
/* harmony import */ var _policies_ndJsonPolicy_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(2212);
/* harmony import */ var _policies_auxiliaryAuthenticationHeaderPolicy_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(2213);
/* harmony import */ var _policies_agentPolicy_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(2192);
/* harmony import */ var _util_file_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(2176);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


























//# sourceMappingURL=index.js.map

/***/ },

/***/ 2163
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logger: () => (/* binding */ logger)
/* harmony export */ });
/* harmony import */ var _azure_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2164);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const logger = (0,_azure_logger__WEBPACK_IMPORTED_MODULE_0__.createClientLogger)("core-rest-pipeline");
//# sourceMappingURL=log.js.map

/***/ },

/***/ 2103
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createEmptyPipeline: () => (/* binding */ createEmptyPipeline)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2104);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Creates a totally empty pipeline.
 * Useful for testing or creating a custom one.
 */
function createEmptyPipeline() {
    return (0,_typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__.createEmptyPipeline)();
}
//# sourceMappingURL=pipeline.js.map

/***/ },

/***/ 2205
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPipelineRequest: () => (/* binding */ createPipelineRequest)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2104);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Creates a new pipeline request with the given options.
 * This method is to allow for the easy setting of default values and not required.
 * @param options - The options to create the request with.
 */
function createPipelineRequest(options) {
    // Cast required due to difference between ts-http-runtime requiring AbortSignal while core-rest-pipeline allows
    // the more generic AbortSignalLike. The wrapAbortSignalLike pipeline policy will take care of ensuring that any AbortSignalLike in the request
    // is converted into a true AbortSignal.
    return (0,_typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__.createPipelineRequest)(options);
}
//# sourceMappingURL=pipelineRequest.js.map

/***/ },

/***/ 2192
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   agentPolicy: () => (/* binding */ agentPolicy),
/* harmony export */   agentPolicyName: () => (/* binding */ agentPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Name of the Agent Policy
 */
const agentPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.agentPolicyName;
/**
 * Gets a pipeline policy that sets http.agent
 */
function agentPolicy(agent) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.agentPolicy)(agent);
}
//# sourceMappingURL=agentPolicy.js.map

/***/ },

/***/ 2213
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   auxiliaryAuthenticationHeaderPolicy: () => (/* binding */ auxiliaryAuthenticationHeaderPolicy),
/* harmony export */   auxiliaryAuthenticationHeaderPolicyName: () => (/* binding */ auxiliaryAuthenticationHeaderPolicyName)
/* harmony export */ });
/* harmony import */ var _util_tokenCycler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2211);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2163);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * The programmatic identifier of the auxiliaryAuthenticationHeaderPolicy.
 */
const auxiliaryAuthenticationHeaderPolicyName = "auxiliaryAuthenticationHeaderPolicy";
const AUTHORIZATION_AUXILIARY_HEADER = "x-ms-authorization-auxiliary";
async function sendAuthorizeRequest(options) {
    const { scopes, getAccessToken, request } = options;
    const getTokenOptions = {
        abortSignal: request.abortSignal,
        tracingOptions: request.tracingOptions,
    };
    return (await getAccessToken(scopes, getTokenOptions))?.token ?? "";
}
/**
 * A policy for external tokens to `x-ms-authorization-auxiliary` header.
 * This header will be used when creating a cross-tenant application we may need to handle authentication requests
 * for resources that are in different tenants.
 * You could see [ARM docs](https://learn.microsoft.com/azure/azure-resource-manager/management/authenticate-multi-tenant) for a rundown of how this feature works
 */
function auxiliaryAuthenticationHeaderPolicy(options) {
    const { credentials, scopes } = options;
    const logger = options.logger || _log_js__WEBPACK_IMPORTED_MODULE_1__.logger;
    const tokenCyclerMap = new WeakMap();
    return {
        name: auxiliaryAuthenticationHeaderPolicyName,
        async sendRequest(request, next) {
            if (!request.url.toLowerCase().startsWith("https://")) {
                throw new Error("Bearer token authentication for auxiliary header is not permitted for non-TLS protected (non-https) URLs.");
            }
            if (!credentials || credentials.length === 0) {
                logger.info(`${auxiliaryAuthenticationHeaderPolicyName} header will not be set due to empty credentials.`);
                return next(request);
            }
            const tokenPromises = [];
            for (const credential of credentials) {
                let getAccessToken = tokenCyclerMap.get(credential);
                if (!getAccessToken) {
                    getAccessToken = (0,_util_tokenCycler_js__WEBPACK_IMPORTED_MODULE_0__.createTokenCycler)(credential);
                    tokenCyclerMap.set(credential, getAccessToken);
                }
                tokenPromises.push(sendAuthorizeRequest({
                    scopes: Array.isArray(scopes) ? scopes : [scopes],
                    request,
                    getAccessToken,
                    logger,
                }));
            }
            const auxiliaryTokens = (await Promise.all(tokenPromises)).filter((token) => Boolean(token));
            if (auxiliaryTokens.length === 0) {
                logger.warning(`None of the auxiliary tokens are valid. ${AUTHORIZATION_AUXILIARY_HEADER} header will not be set.`);
                return next(request);
            }
            request.headers.set(AUTHORIZATION_AUXILIARY_HEADER, auxiliaryTokens.map((token) => `Bearer ${token}`).join(", "));
            return next(request);
        },
    };
}
//# sourceMappingURL=auxiliaryAuthenticationHeaderPolicy.js.map

/***/ },

/***/ 2210
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bearerTokenAuthenticationPolicy: () => (/* binding */ bearerTokenAuthenticationPolicy),
/* harmony export */   bearerTokenAuthenticationPolicyName: () => (/* binding */ bearerTokenAuthenticationPolicyName),
/* harmony export */   parseChallenges: () => (/* binding */ parseChallenges)
/* harmony export */ });
/* harmony import */ var _util_tokenCycler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2211);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2163);
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2200);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



/**
 * The programmatic identifier of the bearerTokenAuthenticationPolicy.
 */
const bearerTokenAuthenticationPolicyName = "bearerTokenAuthenticationPolicy";
/**
 * Try to send the given request.
 *
 * When a response is received, returns a tuple of the response received and, if the response was received
 * inside a thrown RestError, the RestError that was thrown.
 *
 * Otherwise, if an error was thrown while sending the request that did not provide an underlying response, it
 * will be rethrown.
 */
async function trySendRequest(request, next) {
    try {
        return [await next(request), undefined];
    }
    catch (e) {
        if ((0,_restError_js__WEBPACK_IMPORTED_MODULE_2__.isRestError)(e) && e.response) {
            return [e.response, e];
        }
        else {
            throw e;
        }
    }
}
/**
 * Default authorize request handler
 */
async function defaultAuthorizeRequest(options) {
    const { scopes, getAccessToken, request } = options;
    // Enable CAE true by default
    const getTokenOptions = {
        abortSignal: request.abortSignal,
        tracingOptions: request.tracingOptions,
        enableCae: true,
    };
    const accessToken = await getAccessToken(scopes, getTokenOptions);
    if (accessToken) {
        options.request.headers.set("Authorization", `Bearer ${accessToken.token}`);
    }
}
/**
 * We will retrieve the challenge only if the response status code was 401,
 * and if the response contained the header "WWW-Authenticate" with a non-empty value.
 */
function isChallengeResponse(response) {
    return response.status === 401 && response.headers.has("WWW-Authenticate");
}
/**
 * Re-authorize the request for CAE challenge.
 * The response containing the challenge is `options.response`.
 * If this method returns true, the underlying request will be sent once again.
 */
async function authorizeRequestOnCaeChallenge(onChallengeOptions, caeClaims) {
    const { scopes } = onChallengeOptions;
    const accessToken = await onChallengeOptions.getAccessToken(scopes, {
        enableCae: true,
        claims: caeClaims,
    });
    if (!accessToken) {
        return false;
    }
    onChallengeOptions.request.headers.set("Authorization", `${accessToken.tokenType ?? "Bearer"} ${accessToken.token}`);
    return true;
}
/**
 * A policy that can request a token from a TokenCredential implementation and
 * then apply it to the Authorization header of a request as a Bearer token.
 */
function bearerTokenAuthenticationPolicy(options) {
    const { credential, scopes, challengeCallbacks } = options;
    const logger = options.logger || _log_js__WEBPACK_IMPORTED_MODULE_1__.logger;
    const callbacks = {
        authorizeRequest: challengeCallbacks?.authorizeRequest?.bind(challengeCallbacks) ?? defaultAuthorizeRequest,
        authorizeRequestOnChallenge: challengeCallbacks?.authorizeRequestOnChallenge?.bind(challengeCallbacks),
    };
    // This function encapsulates the entire process of reliably retrieving the token
    // The options are left out of the public API until there's demand to configure this.
    // Remember to extend `BearerTokenAuthenticationPolicyOptions` with `TokenCyclerOptions`
    // in order to pass through the `options` object.
    const getAccessToken = credential
        ? (0,_util_tokenCycler_js__WEBPACK_IMPORTED_MODULE_0__.createTokenCycler)(credential /* , options */)
        : () => Promise.resolve(null);
    return {
        name: bearerTokenAuthenticationPolicyName,
        /**
         * If there's no challenge parameter:
         * - It will try to retrieve the token using the cache, or the credential's getToken.
         * - Then it will try the next policy with or without the retrieved token.
         *
         * It uses the challenge parameters to:
         * - Skip a first attempt to get the token from the credential if there's no cached token,
         *   since it expects the token to be retrievable only after the challenge.
         * - Prepare the outgoing request if the `prepareRequest` method has been provided.
         * - Send an initial request to receive the challenge if it fails.
         * - Process a challenge if the response contains it.
         * - Retrieve a token with the challenge information, then re-send the request.
         */
        async sendRequest(request, next) {
            if (!request.url.toLowerCase().startsWith("https://")) {
                throw new Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
            }
            await callbacks.authorizeRequest({
                scopes: Array.isArray(scopes) ? scopes : [scopes],
                request,
                getAccessToken,
                logger,
            });
            let response;
            let error;
            let shouldSendRequest;
            [response, error] = await trySendRequest(request, next);
            if (isChallengeResponse(response)) {
                let claims = getCaeChallengeClaims(response.headers.get("WWW-Authenticate"));
                // Handle CAE by default when receive CAE claim
                if (claims) {
                    let parsedClaim;
                    // Return the response immediately if claims is not a valid base64 encoded string
                    try {
                        parsedClaim = atob(claims);
                    }
                    catch (e) {
                        logger.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${claims}`);
                        return response;
                    }
                    shouldSendRequest = await authorizeRequestOnCaeChallenge({
                        scopes: Array.isArray(scopes) ? scopes : [scopes],
                        response,
                        request,
                        getAccessToken,
                        logger,
                    }, parsedClaim);
                    // Send updated request and handle response for RestError
                    if (shouldSendRequest) {
                        [response, error] = await trySendRequest(request, next);
                    }
                }
                else if (callbacks.authorizeRequestOnChallenge) {
                    // Handle custom challenges when client provides custom callback
                    shouldSendRequest = await callbacks.authorizeRequestOnChallenge({
                        scopes: Array.isArray(scopes) ? scopes : [scopes],
                        request,
                        response,
                        getAccessToken,
                        logger,
                    });
                    // Send updated request and handle response for RestError
                    if (shouldSendRequest) {
                        [response, error] = await trySendRequest(request, next);
                    }
                    // If we get another CAE Claim, we will handle it by default and return whatever value we receive for this
                    if (isChallengeResponse(response)) {
                        claims = getCaeChallengeClaims(response.headers.get("WWW-Authenticate"));
                        if (claims) {
                            let parsedClaim;
                            try {
                                parsedClaim = atob(claims);
                            }
                            catch (e) {
                                logger.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${claims}`);
                                return response;
                            }
                            shouldSendRequest = await authorizeRequestOnCaeChallenge({
                                scopes: Array.isArray(scopes) ? scopes : [scopes],
                                response,
                                request,
                                getAccessToken,
                                logger,
                            }, parsedClaim);
                            // Send updated request and handle response for RestError
                            if (shouldSendRequest) {
                                [response, error] = await trySendRequest(request, next);
                            }
                        }
                    }
                }
            }
            if (error) {
                throw error;
            }
            else {
                return response;
            }
        },
    };
}
/**
 * Converts: `Bearer a="b", c="d", Pop e="f", g="h"`.
 * Into: `[ { scheme: 'Bearer', params: { a: 'b', c: 'd' } }, { scheme: 'Pop', params: { e: 'f', g: 'h' } } ]`.
 *
 * @internal
 */
function parseChallenges(challenges) {
    // Challenge regex seperates the string to individual challenges with different schemes in the format `Scheme a="b", c=d`
    // The challenge regex captures parameteres with either quotes values or unquoted values
    const challengeRegex = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g;
    // Parameter regex captures the claims group removed from the scheme in the format `a="b"` and `c="d"`
    // CAE challenge always have quoted parameters. For more reference, https://learn.microsoft.com/entra/identity-platform/claims-challenge
    const paramRegex = /(\w+)="([^"]*)"/g;
    const parsedChallenges = [];
    let match;
    // Iterate over each challenge match
    while ((match = challengeRegex.exec(challenges)) !== null) {
        const scheme = match[1];
        const paramsString = match[2];
        const params = {};
        let paramMatch;
        // Iterate over each parameter match
        while ((paramMatch = paramRegex.exec(paramsString)) !== null) {
            params[paramMatch[1]] = paramMatch[2];
        }
        parsedChallenges.push({ scheme, params });
    }
    return parsedChallenges;
}
/**
 * Parse a pipeline response and look for a CAE challenge with "Bearer" scheme
 * Return the value in the header without parsing the challenge
 * @internal
 */
function getCaeChallengeClaims(challenges) {
    if (!challenges) {
        return;
    }
    // Find all challenges present in the header
    const parsedChallenges = parseChallenges(challenges);
    return parsedChallenges.find((x) => x.scheme === "Bearer" && x.params.claims && x.params.error === "insufficient_claims")?.params.claims;
}
//# sourceMappingURL=bearerTokenAuthenticationPolicy.js.map

/***/ },

/***/ 2187
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decompressResponsePolicy: () => (/* binding */ decompressResponsePolicy),
/* harmony export */   decompressResponsePolicyName: () => (/* binding */ decompressResponsePolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * The programmatic identifier of the decompressResponsePolicy.
 */
const decompressResponsePolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.decompressResponsePolicyName;
/**
 * A policy to enable response decompression according to Accept-Encoding header
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
 */
function decompressResponsePolicy() {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.decompressResponsePolicy)();
}
//# sourceMappingURL=decompressResponsePolicy.js.map

/***/ },

/***/ 2188
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultRetryPolicy: () => (/* binding */ defaultRetryPolicy),
/* harmony export */   defaultRetryPolicyName: () => (/* binding */ defaultRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Name of the {@link defaultRetryPolicy}
 */
const defaultRetryPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.defaultRetryPolicyName;
/**
 * A policy that retries according to three strategies:
 * - When the server sends a 429 response with a Retry-After header.
 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
 * - Or otherwise if the outgoing request fails, it will retry with an exponentially increasing delay.
 */
function defaultRetryPolicy(options = {}) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.defaultRetryPolicy)(options);
}
//# sourceMappingURL=defaultRetryPolicy.js.map

/***/ },

/***/ 2206
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exponentialRetryPolicy: () => (/* binding */ exponentialRetryPolicy),
/* harmony export */   exponentialRetryPolicyName: () => (/* binding */ exponentialRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * The programmatic identifier of the exponentialRetryPolicy.
 */
const exponentialRetryPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.exponentialRetryPolicyName;
/**
 * A policy that attempts to retry requests while introducing an exponentially increasing delay.
 * @param options - Options that configure retry logic.
 */
function exponentialRetryPolicy(options = {}) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.exponentialRetryPolicy)(options);
}
//# sourceMappingURL=exponentialRetryPolicy.js.map

/***/ },

/***/ 2189
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formDataPolicy: () => (/* binding */ formDataPolicy),
/* harmony export */   formDataPolicyName: () => (/* binding */ formDataPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * The programmatic identifier of the formDataPolicy.
 */
const formDataPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.formDataPolicyName;
/**
 * A policy that encodes FormData on the request into the body.
 */
function formDataPolicy() {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.formDataPolicy)();
}
//# sourceMappingURL=formDataPolicy.js.map

/***/ },

/***/ 2162
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logPolicy: () => (/* binding */ logPolicy),
/* harmony export */   logPolicyName: () => (/* binding */ logPolicyName)
/* harmony export */ });
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2163);
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * The programmatic identifier of the logPolicy.
 */
const logPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_1__.logPolicyName;
/**
 * A policy that logs all requests and responses.
 * @param options - Options to configure logPolicy.
 */
function logPolicy(options = {}) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_1__.logPolicy)({
        logger: _log_js__WEBPACK_IMPORTED_MODULE_0__.logger.info,
        ...options,
    });
}
//# sourceMappingURL=logPolicy.js.map

/***/ },

/***/ 2175
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   multipartPolicy: () => (/* binding */ multipartPolicy),
/* harmony export */   multipartPolicyName: () => (/* binding */ multipartPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
/* harmony import */ var _util_file_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2176);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * Name of multipart policy
 */
const multipartPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.multipartPolicyName;
/**
 * Pipeline policy for multipart requests
 */
function multipartPolicy() {
    const tspPolicy = (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.multipartPolicy)();
    return {
        name: multipartPolicyName,
        sendRequest: async (request, next) => {
            if (request.multipartBody) {
                for (const part of request.multipartBody.parts) {
                    if ((0,_util_file_js__WEBPACK_IMPORTED_MODULE_1__.hasRawContent)(part.body)) {
                        part.body = (0,_util_file_js__WEBPACK_IMPORTED_MODULE_1__.getRawContent)(part.body);
                    }
                }
            }
            return tspPolicy.sendRequest(request, next);
        },
    };
}
//# sourceMappingURL=multipartPolicy.js.map

/***/ },

/***/ 2212
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ndJsonPolicy: () => (/* binding */ ndJsonPolicy),
/* harmony export */   ndJsonPolicyName: () => (/* binding */ ndJsonPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * The programmatic identifier of the ndJsonPolicy.
 */
const ndJsonPolicyName = "ndJsonPolicy";
/**
 * ndJsonPolicy is a policy used to control keep alive settings for every request.
 */
function ndJsonPolicy() {
    return {
        name: ndJsonPolicyName,
        async sendRequest(request, next) {
            // There currently isn't a good way to bypass the serializer
            if (typeof request.body === "string" && request.body.startsWith("[")) {
                const body = JSON.parse(request.body);
                if (Array.isArray(body)) {
                    request.body = body.map((item) => JSON.stringify(item) + "\n").join("");
                }
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=ndJsonPolicy.js.map

/***/ },

/***/ 2190
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultProxySettings: () => (/* binding */ getDefaultProxySettings),
/* harmony export */   proxyPolicy: () => (/* binding */ proxyPolicy),
/* harmony export */   proxyPolicyName: () => (/* binding */ proxyPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * The programmatic identifier of the proxyPolicy.
 */
const proxyPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.proxyPolicyName;
/**
 * This method converts a proxy url into `ProxySettings` for use with ProxyPolicy.
 * If no argument is given, it attempts to parse a proxy URL from the environment
 * variables `HTTPS_PROXY` or `HTTP_PROXY`.
 * @param proxyUrl - The url of the proxy to use. May contain authentication information.
 * @deprecated - Internally this method is no longer necessary when setting proxy information.
 */
function getDefaultProxySettings(proxyUrl) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.getDefaultProxySettings)(proxyUrl);
}
/**
 * A policy that allows one to apply proxy settings to all requests.
 * If not passed static settings, they will be retrieved from the HTTPS_PROXY
 * or HTTP_PROXY environment variables.
 * @param proxySettings - ProxySettings to use on each request.
 * @param options - additional settings, for example, custom NO_PROXY patterns
 */
function proxyPolicy(proxySettings, options) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.proxyPolicy)(proxySettings, options);
}
//# sourceMappingURL=proxyPolicy.js.map

/***/ },

/***/ 2170
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   redirectPolicy: () => (/* binding */ redirectPolicy),
/* harmony export */   redirectPolicyName: () => (/* binding */ redirectPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * The programmatic identifier of the redirectPolicy.
 */
const redirectPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.redirectPolicyName;
/**
 * A policy to follow Location headers from the server in order
 * to support server-side redirection.
 * In the browser, this policy is not used.
 * @param options - Options to control policy behavior.
 */
function redirectPolicy(options = {}) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.redirectPolicy)(options);
}
//# sourceMappingURL=redirectPolicy.js.map

/***/ },

/***/ 2209
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   retryPolicy: () => (/* binding */ retryPolicy)
/* harmony export */ });
/* harmony import */ var _azure_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2164);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2174);
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



const retryPolicyLogger = (0,_azure_logger__WEBPACK_IMPORTED_MODULE_0__.createClientLogger)("core-rest-pipeline retryPolicy");
/**
 * retryPolicy is a generic policy to enable retrying requests when certain conditions are met
 */
function retryPolicy(strategies, options = { maxRetries: _constants_js__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_RETRY_POLICY_COUNT }) {
    // Cast is required since the TSP runtime retry strategy type is slightly different
    // very deep down (using real AbortSignal vs. AbortSignalLike in RestError).
    // In practice the difference doesn't actually matter.
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_2__.retryPolicy)(strategies, {
        logger: retryPolicyLogger,
        ...options,
    });
}
//# sourceMappingURL=retryPolicy.js.map

/***/ },

/***/ 2191
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setClientRequestIdPolicy: () => (/* binding */ setClientRequestIdPolicy),
/* harmony export */   setClientRequestIdPolicyName: () => (/* binding */ setClientRequestIdPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * The programmatic identifier of the setClientRequestIdPolicy.
 */
const setClientRequestIdPolicyName = "setClientRequestIdPolicy";
/**
 * Each PipelineRequest gets a unique id upon creation.
 * This policy passes that unique id along via an HTTP header to enable better
 * telemetry and tracing.
 * @param requestIdHeaderName - The name of the header to pass the request ID to.
 */
function setClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id") {
    return {
        name: setClientRequestIdPolicyName,
        async sendRequest(request, next) {
            if (!request.headers.has(requestIdHeaderName)) {
                request.headers.set(requestIdHeaderName, request.requestId);
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=setClientRequestIdPolicy.js.map

/***/ },

/***/ 2207
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   systemErrorRetryPolicy: () => (/* binding */ systemErrorRetryPolicy),
/* harmony export */   systemErrorRetryPolicyName: () => (/* binding */ systemErrorRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Name of the {@link systemErrorRetryPolicy}
 */
const systemErrorRetryPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.systemErrorRetryPolicyName;
/**
 * A retry policy that specifically seeks to handle errors in the
 * underlying transport layer (e.g. DNS lookup failures) rather than
 * retryable error codes from the server itself.
 * @param options - Options that customize the policy.
 */
function systemErrorRetryPolicy(options = {}) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.systemErrorRetryPolicy)(options);
}
//# sourceMappingURL=systemErrorRetryPolicy.js.map

/***/ },

/***/ 2208
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   throttlingRetryPolicy: () => (/* binding */ throttlingRetryPolicy),
/* harmony export */   throttlingRetryPolicyName: () => (/* binding */ throttlingRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Name of the {@link throttlingRetryPolicy}
 */
const throttlingRetryPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.throttlingRetryPolicyName;
/**
 * A policy that retries when the server sends a 429 response with a Retry-After header.
 *
 * To learn more, please refer to
 * https://learn.microsoft.com/azure/azure-resource-manager/resource-manager-request-limits,
 * https://learn.microsoft.com/azure/azure-subscription-service-limits and
 * https://learn.microsoft.com/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
 *
 * @param options - Options that configure retry logic.
 */
function throttlingRetryPolicy(options = {}) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.throttlingRetryPolicy)(options);
}
//# sourceMappingURL=throttlingRetryPolicy.js.map

/***/ },

/***/ 2193
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tlsPolicy: () => (/* binding */ tlsPolicy),
/* harmony export */   tlsPolicyName: () => (/* binding */ tlsPolicyName)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2166);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Name of the TLS Policy
 */
const tlsPolicyName = _typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.tlsPolicyName;
/**
 * Gets a pipeline policy that adds the client certificate to the HttpClient agent for authentication.
 */
function tlsPolicy(tlsSettings) {
    return (0,_typespec_ts_http_runtime_internal_policies__WEBPACK_IMPORTED_MODULE_0__.tlsPolicy)(tlsSettings);
}
//# sourceMappingURL=tlsPolicy.js.map

/***/ },

/***/ 2194
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tracingPolicy: () => (/* binding */ tracingPolicy),
/* harmony export */   tracingPolicyName: () => (/* binding */ tracingPolicyName)
/* harmony export */ });
/* harmony import */ var _azure_core_tracing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2195);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2174);
/* harmony import */ var _util_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2172);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2163);
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2177);
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2200);
/* harmony import */ var _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2178);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.







/**
 * The programmatic identifier of the tracingPolicy.
 */
const tracingPolicyName = "tracingPolicy";
/**
 * A simple policy to create OpenTelemetry Spans for each request made by the pipeline
 * that has SpanOptions with a parent.
 * Requests made without a parent Span will not be recorded.
 * @param options - Options to configure the telemetry logged by the tracing policy.
 */
function tracingPolicy(options = {}) {
    const userAgentPromise = (0,_util_userAgent_js__WEBPACK_IMPORTED_MODULE_2__.getUserAgentValue)(options.userAgentPrefix);
    const sanitizer = new _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_6__.Sanitizer({
        additionalAllowedQueryParameters: options.additionalAllowedQueryParameters,
    });
    const tracingClient = tryCreateTracingClient();
    return {
        name: tracingPolicyName,
        async sendRequest(request, next) {
            if (!tracingClient) {
                return next(request);
            }
            const userAgent = await userAgentPromise;
            const spanAttributes = {
                "http.url": sanitizer.sanitizeUrl(request.url),
                "http.method": request.method,
                "http.user_agent": userAgent,
                requestId: request.requestId,
            };
            if (userAgent) {
                spanAttributes["http.user_agent"] = userAgent;
            }
            const { span, tracingContext } = tryCreateSpan(tracingClient, request, spanAttributes) ?? {};
            if (!span || !tracingContext) {
                return next(request);
            }
            try {
                const response = await tracingClient.withContext(tracingContext, next, request);
                tryProcessResponse(span, response);
                return response;
            }
            catch (err) {
                tryProcessError(span, err);
                throw err;
            }
        },
    };
}
function tryCreateTracingClient() {
    try {
        return (0,_azure_core_tracing__WEBPACK_IMPORTED_MODULE_0__.createTracingClient)({
            namespace: "",
            packageName: "@azure/core-rest-pipeline",
            packageVersion: _constants_js__WEBPACK_IMPORTED_MODULE_1__.SDK_VERSION,
        });
    }
    catch (e) {
        _log_js__WEBPACK_IMPORTED_MODULE_3__.logger.warning(`Error when creating the TracingClient: ${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage)(e)}`);
        return undefined;
    }
}
function tryCreateSpan(tracingClient, request, spanAttributes) {
    try {
        // As per spec, we do not need to differentiate between HTTP and HTTPS in span name.
        const { span, updatedOptions } = tracingClient.startSpan(`HTTP ${request.method}`, { tracingOptions: request.tracingOptions }, {
            spanKind: "client",
            spanAttributes,
        });
        // If the span is not recording, don't do any more work.
        if (!span.isRecording()) {
            span.end();
            return undefined;
        }
        // set headers
        const headers = tracingClient.createRequestHeaders(updatedOptions.tracingOptions.tracingContext);
        for (const [key, value] of Object.entries(headers)) {
            request.headers.set(key, value);
        }
        return { span, tracingContext: updatedOptions.tracingOptions.tracingContext };
    }
    catch (e) {
        _log_js__WEBPACK_IMPORTED_MODULE_3__.logger.warning(`Skipping creating a tracing span due to an error: ${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage)(e)}`);
        return undefined;
    }
}
function tryProcessError(span, error) {
    try {
        span.setStatus({
            status: "error",
            error: (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.isError)(error) ? error : undefined,
        });
        if ((0,_restError_js__WEBPACK_IMPORTED_MODULE_5__.isRestError)(error) && error.statusCode) {
            span.setAttribute("http.status_code", error.statusCode);
        }
        span.end();
    }
    catch (e) {
        _log_js__WEBPACK_IMPORTED_MODULE_3__.logger.warning(`Skipping tracing span processing due to an error: ${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage)(e)}`);
    }
}
function tryProcessResponse(span, response) {
    try {
        span.setAttribute("http.status_code", response.status);
        const serviceRequestId = response.headers.get("x-ms-request-id");
        if (serviceRequestId) {
            span.setAttribute("serviceRequestId", serviceRequestId);
        }
        // Per semantic conventions, only set the status to error if the status code is 4xx or 5xx.
        // Otherwise, the status MUST remain unset.
        // https://opentelemetry.io/docs/specs/semconv/http/http-spans/#status
        if (response.status >= 400) {
            span.setStatus({
                status: "error",
            });
        }
        span.end();
    }
    catch (e) {
        _log_js__WEBPACK_IMPORTED_MODULE_3__.logger.warning(`Skipping tracing span processing due to an error: ${(0,_azure_core_util__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage)(e)}`);
    }
}
//# sourceMappingURL=tracingPolicy.js.map

/***/ },

/***/ 2171
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   userAgentPolicy: () => (/* binding */ userAgentPolicy),
/* harmony export */   userAgentPolicyName: () => (/* binding */ userAgentPolicyName)
/* harmony export */ });
/* harmony import */ var _util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2172);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const UserAgentHeaderName = (0,_util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeaderName)();
/**
 * The programmatic identifier of the userAgentPolicy.
 */
const userAgentPolicyName = "userAgentPolicy";
/**
 * A policy that sets the User-Agent header (or equivalent) to reflect
 * the library version.
 * @param options - Options to customize the user agent value.
 */
function userAgentPolicy(options = {}) {
    const userAgentValue = (0,_util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__.getUserAgentValue)(options.userAgentPrefix);
    return {
        name: userAgentPolicyName,
        async sendRequest(request, next) {
            if (!request.headers.has(UserAgentHeaderName)) {
                request.headers.set(UserAgentHeaderName, await userAgentValue);
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=userAgentPolicy.js.map

/***/ },

/***/ 2201
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   wrapAbortSignalLikePolicy: () => (/* binding */ wrapAbortSignalLikePolicy),
/* harmony export */   wrapAbortSignalLikePolicyName: () => (/* binding */ wrapAbortSignalLikePolicyName)
/* harmony export */ });
/* harmony import */ var _util_wrapAbortSignal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2202);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const wrapAbortSignalLikePolicyName = "wrapAbortSignalLikePolicy";
/**
 * Policy that ensure that any AbortSignalLike is wrapped in a native AbortSignal for processing by the pipeline.
 * Since the ts-http-runtime expects a native AbortSignal, this policy is used to ensure that any AbortSignalLike is wrapped in a native AbortSignal.
 *
 * @returns - created policy
 */
function wrapAbortSignalLikePolicy() {
    return {
        name: wrapAbortSignalLikePolicyName,
        sendRequest: async (request, next) => {
            if (!request.abortSignal) {
                return next(request);
            }
            const { abortSignal, cleanup } = (0,_util_wrapAbortSignal_js__WEBPACK_IMPORTED_MODULE_0__.wrapAbortSignalLike)(request.abortSignal);
            request.abortSignal = abortSignal;
            try {
                return await next(request);
            }
            finally {
                cleanup?.();
            }
        },
    };
}
//# sourceMappingURL=wrapAbortSignalLikePolicy.js.map

/***/ },

/***/ 2200
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RestError: () => (/* binding */ RestError),
/* harmony export */   isRestError: () => (/* binding */ isRestError)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2104);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * A custom error type for failed pipeline requests.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
const RestError = _typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__.RestError;
/**
 * Typeguard for RestError
 * @param e - Something caught by a catch clause.
 */
function isRestError(e) {
    return (0,_typespec_ts_http_runtime__WEBPACK_IMPORTED_MODULE_0__.isRestError)(e);
}
//# sourceMappingURL=restError.js.map

/***/ },

/***/ 2176
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFile: () => (/* binding */ createFile),
/* harmony export */   createFileFromStream: () => (/* binding */ createFileFromStream),
/* harmony export */   getRawContent: () => (/* binding */ getRawContent),
/* harmony export */   hasRawContent: () => (/* binding */ hasRawContent)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2177);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

function isNodeReadableStream(x) {
    return Boolean(x && typeof x["pipe"] === "function");
}
const unimplementedMethods = {
    arrayBuffer: () => {
        throw new Error("Not implemented");
    },
    bytes: () => {
        throw new Error("Not implemented");
    },
    slice: () => {
        throw new Error("Not implemented");
    },
    text: () => {
        throw new Error("Not implemented");
    },
};
/**
 * Private symbol used as key on objects created using createFile containing the
 * original source of the file object.
 *
 * This is used in Node to access the original Node stream without using Blob#stream, which
 * returns a web stream. This is done to avoid a couple of bugs to do with Blob#stream and
 * Readable#to/fromWeb in Node versions we support:
 * - https://github.com/nodejs/node/issues/42694 (fixed in Node 18.14)
 * - https://github.com/nodejs/node/issues/48916 (fixed in Node 20.6)
 *
 * Once these versions are no longer supported, we may be able to stop doing this.
 *
 * @internal
 */
const rawContent = Symbol("rawContent");
/**
 * Type guard to check if a given object is a blob-like object with a raw content property.
 */
function hasRawContent(x) {
    return typeof x[rawContent] === "function";
}
/**
 * Extract the raw content from a given blob-like object. If the input was created using createFile
 * or createFileFromStream, the exact content passed into createFile/createFileFromStream will be used.
 * For true instances of Blob and File, returns the actual blob.
 *
 * @internal
 */
function getRawContent(blob) {
    if (hasRawContent(blob)) {
        return blob[rawContent]();
    }
    else {
        return blob;
    }
}
/**
 * Create an object that implements the File interface. This object is intended to be
 * passed into RequestBodyType.formData, and is not guaranteed to work as expected in
 * other situations.
 *
 * Use this function to:
 * - Create a File object for use in RequestBodyType.formData in environments where the
 *   global File object is unavailable.
 * - Create a File-like object from a readable stream without reading the stream into memory.
 *
 * @param stream - the content of the file as a callback returning a stream. When a File object made using createFile is
 *                  passed in a request's form data map, the stream will not be read into memory
 *                  and instead will be streamed when the request is made. In the event of a retry, the
 *                  stream needs to be read again, so this callback SHOULD return a fresh stream if possible.
 * @param name - the name of the file.
 * @param options - optional metadata about the file, e.g. file name, file size, MIME type.
 */
function createFileFromStream(stream, name, options = {}) {
    return {
        ...unimplementedMethods,
        type: options.type ?? "",
        lastModified: options.lastModified ?? new Date().getTime(),
        webkitRelativePath: options.webkitRelativePath ?? "",
        size: options.size ?? -1,
        name,
        stream: () => {
            const s = stream();
            if (isNodeReadableStream(s)) {
                throw new Error("Not supported: a Node stream was provided as input to createFileFromStream.");
            }
            return s;
        },
        [rawContent]: stream,
    };
}
/**
 * Create an object that implements the File interface. This object is intended to be
 * passed into RequestBodyType.formData, and is not guaranteed to work as expected in
 * other situations.
 *
 * Use this function create a File object for use in RequestBodyType.formData in environments where the global File object is unavailable.
 *
 * @param content - the content of the file as a Uint8Array in memory.
 * @param name - the name of the file.
 * @param options - optional metadata about the file, e.g. file name, file size, MIME type.
 */
function createFile(content, name, options = {}) {
    if (_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.isNodeLike) {
        return {
            ...unimplementedMethods,
            type: options.type ?? "",
            lastModified: options.lastModified ?? new Date().getTime(),
            webkitRelativePath: options.webkitRelativePath ?? "",
            size: content.byteLength,
            name,
            arrayBuffer: async () => content.buffer,
            stream: () => new Blob([toArrayBuffer(content)]).stream(),
            [rawContent]: () => content,
        };
    }
    else {
        return new File([toArrayBuffer(content)], name, options);
    }
}
function toArrayBuffer(source) {
    if ("resize" in source.buffer) {
        // ArrayBuffer
        return source;
    }
    // SharedArrayBuffer
    return source.map((x) => x);
}
//# sourceMappingURL=file.js.map

/***/ },

/***/ 2211
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CYCLER_OPTIONS: () => (/* binding */ DEFAULT_CYCLER_OPTIONS),
/* harmony export */   createTokenCycler: () => (/* binding */ createTokenCycler)
/* harmony export */ });
/* harmony import */ var _azure_core_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2177);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Default options for the cycler if none are provided
const DEFAULT_CYCLER_OPTIONS = {
    forcedRefreshWindowInMs: 1000, // Force waiting for a refresh 1s before the token expires
    retryIntervalInMs: 3000, // Allow refresh attempts every 3s
    refreshWindowInMs: 1000 * 60 * 2, // Start refreshing 2m before expiry
};
/**
 * Converts an an unreliable access token getter (which may resolve with null)
 * into an AccessTokenGetter by retrying the unreliable getter in a regular
 * interval.
 *
 * @param getAccessToken - A function that produces a promise of an access token that may fail by returning null.
 * @param retryIntervalInMs - The time (in milliseconds) to wait between retry attempts.
 * @param refreshTimeout - The timestamp after which the refresh attempt will fail, throwing an exception.
 * @returns - A promise that, if it resolves, will resolve with an access token.
 */
async function beginRefresh(getAccessToken, retryIntervalInMs, refreshTimeout) {
    // This wrapper handles exceptions gracefully as long as we haven't exceeded
    // the timeout.
    async function tryGetAccessToken() {
        if (Date.now() < refreshTimeout) {
            try {
                return await getAccessToken();
            }
            catch {
                return null;
            }
        }
        else {
            const finalToken = await getAccessToken();
            // Timeout is up, so throw if it's still null
            if (finalToken === null) {
                throw new Error("Failed to refresh access token.");
            }
            return finalToken;
        }
    }
    let token = await tryGetAccessToken();
    while (token === null) {
        await (0,_azure_core_util__WEBPACK_IMPORTED_MODULE_0__.delay)(retryIntervalInMs);
        token = await tryGetAccessToken();
    }
    return token;
}
/**
 * Creates a token cycler from a credential, scopes, and optional settings.
 *
 * A token cycler represents a way to reliably retrieve a valid access token
 * from a TokenCredential. It will handle initializing the token, refreshing it
 * when it nears expiration, and synchronizes refresh attempts to avoid
 * concurrency hazards.
 *
 * @param credential - the underlying TokenCredential that provides the access
 * token
 * @param tokenCyclerOptions - optionally override default settings for the cycler
 *
 * @returns - a function that reliably produces a valid access token
 */
function createTokenCycler(credential, tokenCyclerOptions) {
    let refreshWorker = null;
    let token = null;
    let tenantId;
    const options = {
        ...DEFAULT_CYCLER_OPTIONS,
        ...tokenCyclerOptions,
    };
    /**
     * This little holder defines several predicates that we use to construct
     * the rules of refreshing the token.
     */
    const cycler = {
        /**
         * Produces true if a refresh job is currently in progress.
         */
        get isRefreshing() {
            return refreshWorker !== null;
        },
        /**
         * Produces true if the cycler SHOULD refresh (we are within the refresh
         * window and not already refreshing)
         */
        get shouldRefresh() {
            if (cycler.isRefreshing) {
                return false;
            }
            if (token?.refreshAfterTimestamp && token.refreshAfterTimestamp < Date.now()) {
                return true;
            }
            return (token?.expiresOnTimestamp ?? 0) - options.refreshWindowInMs < Date.now();
        },
        /**
         * Produces true if the cycler MUST refresh (null or nearly-expired
         * token).
         */
        get mustRefresh() {
            return (token === null || token.expiresOnTimestamp - options.forcedRefreshWindowInMs < Date.now());
        },
    };
    /**
     * Starts a refresh job or returns the existing job if one is already
     * running.
     */
    function refresh(scopes, getTokenOptions) {
        if (!cycler.isRefreshing) {
            // We bind `scopes` here to avoid passing it around a lot
            const tryGetAccessToken = () => credential.getToken(scopes, getTokenOptions);
            // Take advantage of promise chaining to insert an assignment to `token`
            // before the refresh can be considered done.
            refreshWorker = beginRefresh(tryGetAccessToken, options.retryIntervalInMs, 
            // If we don't have a token, then we should timeout immediately
            token?.expiresOnTimestamp ?? Date.now())
                .then((_token) => {
                refreshWorker = null;
                token = _token;
                tenantId = getTokenOptions.tenantId;
                return token;
            })
                .catch((reason) => {
                // We also should reset the refresher if we enter a failed state.  All
                // existing awaiters will throw, but subsequent requests will start a
                // new retry chain.
                refreshWorker = null;
                token = null;
                tenantId = undefined;
                throw reason;
            });
        }
        return refreshWorker;
    }
    return async (scopes, tokenOptions) => {
        //
        // Simple rules:
        // - If we MUST refresh, then return the refresh task, blocking
        //   the pipeline until a token is available.
        // - If we SHOULD refresh, then run refresh but don't return it
        //   (we can still use the cached token).
        // - Return the token, since it's fine if we didn't return in
        //   step 1.
        //
        const hasClaimChallenge = Boolean(tokenOptions.claims);
        const tenantIdChanged = tenantId !== tokenOptions.tenantId;
        if (hasClaimChallenge) {
            // If we've received a claim, we know the existing token isn't valid
            // We want to clear it so that that refresh worker won't use the old expiration time as a timeout
            token = null;
        }
        // If the tenantId passed in token options is different to the one we have
        // Or if we are in claim challenge and the token was rejected and a new access token need to be issued, we need to
        // refresh the token with the new tenantId or token.
        const mustRefresh = tenantIdChanged || hasClaimChallenge || cycler.mustRefresh;
        if (mustRefresh) {
            return refresh(scopes, tokenOptions);
        }
        if (cycler.shouldRefresh) {
            refresh(scopes, tokenOptions);
        }
        return token;
    };
}
//# sourceMappingURL=tokenCycler.js.map

/***/ },

/***/ 2172
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getUserAgentHeaderName: () => (/* binding */ getUserAgentHeaderName),
/* harmony export */   getUserAgentValue: () => (/* binding */ getUserAgentValue)
/* harmony export */ });
/* harmony import */ var _userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2173);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2174);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


function getUserAgentString(telemetryInfo) {
    const parts = [];
    for (const [key, value] of telemetryInfo) {
        const token = value ? `${key}/${value}` : key;
        parts.push(token);
    }
    return parts.join(" ");
}
/**
 * @internal
 */
function getUserAgentHeaderName() {
    return (0,_userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__.getHeaderName)();
}
/**
 * @internal
 */
async function getUserAgentValue(prefix) {
    const runtimeInfo = new Map();
    runtimeInfo.set("core-rest-pipeline", _constants_js__WEBPACK_IMPORTED_MODULE_1__.SDK_VERSION);
    await (0,_userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__.setPlatformSpecificData)(runtimeInfo);
    const defaultAgent = getUserAgentString(runtimeInfo);
    const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
    return userAgentValue;
}
//# sourceMappingURL=userAgent.js.map

/***/ },

/***/ 2173
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHeaderName: () => (/* binding */ getHeaderName),
/* harmony export */   setPlatformSpecificData: () => (/* binding */ setPlatformSpecificData)
/* harmony export */ });
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1925);
/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1450);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * @internal
 */
function getHeaderName() {
    return "User-Agent";
}
/**
 * @internal
 */
async function setPlatformSpecificData(map) {
    if (node_process__WEBPACK_IMPORTED_MODULE_1__ && node_process__WEBPACK_IMPORTED_MODULE_1__.versions) {
        const osInfo = `${node_os__WEBPACK_IMPORTED_MODULE_0__.type()} ${node_os__WEBPACK_IMPORTED_MODULE_0__.release()}; ${node_os__WEBPACK_IMPORTED_MODULE_0__.arch()}`;
        const versions = node_process__WEBPACK_IMPORTED_MODULE_1__.versions;
        if (versions.bun) {
            map.set("Bun", `${versions.bun} (${osInfo})`);
        }
        else if (versions.deno) {
            map.set("Deno", `${versions.deno} (${osInfo})`);
        }
        else if (versions.node) {
            map.set("Node", `${versions.node} (${osInfo})`);
        }
    }
}
//# sourceMappingURL=userAgentPlatform.js.map

/***/ },

/***/ 2202
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   wrapAbortSignalLike: () => (/* binding */ wrapAbortSignalLike)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Creates a native AbortSignal which reflects the state of the provided AbortSignalLike.
 * If the AbortSignalLike is already a native AbortSignal, it is returned as is.
 * @param abortSignalLike - The AbortSignalLike to wrap.
 * @returns - An object containing the native AbortSignal and an optional cleanup function. The cleanup function should be called when the AbortSignal is no longer needed.
 */
function wrapAbortSignalLike(abortSignalLike) {
    if (abortSignalLike instanceof AbortSignal) {
        return { abortSignal: abortSignalLike };
    }
    if (abortSignalLike.aborted) {
        return { abortSignal: AbortSignal.abort(abortSignalLike.reason) };
    }
    const controller = new AbortController();
    let needsCleanup = true;
    function cleanup() {
        if (needsCleanup) {
            abortSignalLike.removeEventListener("abort", listener);
            needsCleanup = false;
        }
    }
    function listener() {
        controller.abort(abortSignalLike.reason);
        cleanup();
    }
    abortSignalLike.addEventListener("abort", listener);
    return { abortSignal: controller.signal, cleanup };
}
//# sourceMappingURL=wrapAbortSignal.js.map

/***/ },

/***/ 2195
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTracingClient: () => (/* reexport safe */ _tracingClient_js__WEBPACK_IMPORTED_MODULE_1__.createTracingClient),
/* harmony export */   useInstrumenter: () => (/* reexport safe */ _instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.useInstrumenter)
/* harmony export */ });
/* harmony import */ var _instrumenter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2196);
/* harmony import */ var _tracingClient_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2199);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


//# sourceMappingURL=index.js.map

/***/ },

/***/ 2196
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDefaultInstrumenter: () => (/* binding */ createDefaultInstrumenter),
/* harmony export */   createDefaultTracingSpan: () => (/* binding */ createDefaultTracingSpan),
/* harmony export */   getInstrumenter: () => (/* binding */ getInstrumenter),
/* harmony export */   useInstrumenter: () => (/* binding */ useInstrumenter)
/* harmony export */ });
/* harmony import */ var _tracingContext_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2197);
/* harmony import */ var _state_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2198);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


function createDefaultTracingSpan() {
    return {
        end: () => {
            // noop
        },
        isRecording: () => false,
        recordException: () => {
            // noop
        },
        setAttribute: () => {
            // noop
        },
        setStatus: () => {
            // noop
        },
        addEvent: () => {
            // noop
        },
    };
}
function createDefaultInstrumenter() {
    return {
        createRequestHeaders: () => {
            return {};
        },
        parseTraceparentHeader: () => {
            return undefined;
        },
        startSpan: (_name, spanOptions) => {
            return {
                span: createDefaultTracingSpan(),
                tracingContext: (0,_tracingContext_js__WEBPACK_IMPORTED_MODULE_0__.createTracingContext)({ parentContext: spanOptions.tracingContext }),
            };
        },
        withContext(_context, callback, ...callbackArgs) {
            return callback(...callbackArgs);
        },
    };
}
/**
 * Extends the Azure SDK with support for a given instrumenter implementation.
 *
 * @param instrumenter - The instrumenter implementation to use.
 */
function useInstrumenter(instrumenter) {
    _state_js__WEBPACK_IMPORTED_MODULE_1__.state.instrumenterImplementation = instrumenter;
}
/**
 * Gets the currently set instrumenter, a No-Op instrumenter by default.
 *
 * @returns The currently set instrumenter
 */
function getInstrumenter() {
    if (!_state_js__WEBPACK_IMPORTED_MODULE_1__.state.instrumenterImplementation) {
        _state_js__WEBPACK_IMPORTED_MODULE_1__.state.instrumenterImplementation = createDefaultInstrumenter();
    }
    return _state_js__WEBPACK_IMPORTED_MODULE_1__.state.instrumenterImplementation;
}
//# sourceMappingURL=instrumenter.js.map

/***/ },

/***/ 2198
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   state: () => (/* binding */ state)
/* harmony export */ });
/* harmony import */ var _commonjs_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2023);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// @ts-expect-error The recommended approach to sharing module state between ESM and CJS.
// See https://github.com/isaacs/tshy/blob/main/README.md#module-local-state for additional information.

/**
 * Defines the shared state between CJS and ESM by re-exporting the CJS state.
 */
const state = _commonjs_state_js__WEBPACK_IMPORTED_MODULE_0__.state;
//# sourceMappingURL=state.js.map

/***/ },

/***/ 2199
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTracingClient: () => (/* binding */ createTracingClient)
/* harmony export */ });
/* harmony import */ var _instrumenter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2196);
/* harmony import */ var _tracingContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2197);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * Creates a new tracing client.
 *
 * @param options - Options used to configure the tracing client.
 * @returns - An instance of {@link TracingClient}.
 */
function createTracingClient(options) {
    const { namespace, packageName, packageVersion } = options;
    function startSpan(name, operationOptions, spanOptions) {
        const startSpanResult = (0,_instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.getInstrumenter)().startSpan(name, {
            ...spanOptions,
            packageName: packageName,
            packageVersion: packageVersion,
            tracingContext: operationOptions?.tracingOptions?.tracingContext,
        });
        let tracingContext = startSpanResult.tracingContext;
        const span = startSpanResult.span;
        if (!tracingContext.getValue(_tracingContext_js__WEBPACK_IMPORTED_MODULE_1__.knownContextKeys.namespace)) {
            tracingContext = tracingContext.setValue(_tracingContext_js__WEBPACK_IMPORTED_MODULE_1__.knownContextKeys.namespace, namespace);
        }
        span.setAttribute("az.namespace", tracingContext.getValue(_tracingContext_js__WEBPACK_IMPORTED_MODULE_1__.knownContextKeys.namespace));
        const updatedOptions = Object.assign({}, operationOptions, {
            tracingOptions: { ...operationOptions?.tracingOptions, tracingContext },
        });
        return {
            span,
            updatedOptions,
        };
    }
    async function withSpan(name, operationOptions, callback, spanOptions) {
        const { span, updatedOptions } = startSpan(name, operationOptions, spanOptions);
        try {
            const result = await withContext(updatedOptions.tracingOptions.tracingContext, () => Promise.resolve(callback(updatedOptions, span)));
            span.setStatus({ status: "success" });
            return result;
        }
        catch (err) {
            span.setStatus({ status: "error", error: err });
            throw err;
        }
        finally {
            span.end();
        }
    }
    function withContext(context, callback, ...callbackArgs) {
        return (0,_instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.getInstrumenter)().withContext(context, callback, ...callbackArgs);
    }
    /**
     * Parses a traceparent header value into a span identifier.
     *
     * @param traceparentHeader - The traceparent header to parse.
     * @returns An implementation-specific identifier for the span.
     */
    function parseTraceparentHeader(traceparentHeader) {
        return (0,_instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.getInstrumenter)().parseTraceparentHeader(traceparentHeader);
    }
    /**
     * Creates a set of request headers to propagate tracing information to a backend.
     *
     * @param tracingContext - The context containing the span to serialize.
     * @returns The set of headers to add to a request.
     */
    function createRequestHeaders(tracingContext) {
        return (0,_instrumenter_js__WEBPACK_IMPORTED_MODULE_0__.getInstrumenter)().createRequestHeaders(tracingContext);
    }
    return {
        startSpan,
        withSpan,
        withContext,
        parseTraceparentHeader,
        createRequestHeaders,
    };
}
//# sourceMappingURL=tracingClient.js.map

/***/ },

/***/ 2197
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TracingContextImpl: () => (/* binding */ TracingContextImpl),
/* harmony export */   createTracingContext: () => (/* binding */ createTracingContext),
/* harmony export */   knownContextKeys: () => (/* binding */ knownContextKeys)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/** @internal */
const knownContextKeys = {
    span: Symbol.for("@azure/core-tracing span"),
    namespace: Symbol.for("@azure/core-tracing namespace"),
};
/**
 * Creates a new {@link TracingContext} with the given options.
 * @param options - A set of known keys that may be set on the context.
 * @returns A new {@link TracingContext} with the given options.
 *
 * @internal
 */
function createTracingContext(options = {}) {
    let context = new TracingContextImpl(options.parentContext);
    if (options.span) {
        context = context.setValue(knownContextKeys.span, options.span);
    }
    if (options.namespace) {
        context = context.setValue(knownContextKeys.namespace, options.namespace);
    }
    return context;
}
/** @internal */
class TracingContextImpl {
    _contextMap;
    constructor(initialContext) {
        this._contextMap =
            initialContext instanceof TracingContextImpl
                ? new Map(initialContext._contextMap)
                : new Map();
    }
    setValue(key, value) {
        const newContext = new TracingContextImpl(this);
        newContext._contextMap.set(key, value);
        return newContext;
    }
    getValue(key) {
        return this._contextMap.get(key);
    }
    deleteValue(key) {
        const newContext = new TracingContextImpl(this);
        newContext._contextMap.delete(key);
        return newContext;
    }
}
//# sourceMappingURL=tracingContext.js.map

/***/ },

/***/ 2180
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cancelablePromiseRace: () => (/* binding */ cancelablePromiseRace)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * promise.race() wrapper that aborts rest of promises as soon as the first promise settles.
 */
async function cancelablePromiseRace(abortablePromiseBuilders, options) {
    const aborter = new AbortController();
    function abortHandler() {
        aborter.abort();
    }
    options?.abortSignal?.addEventListener("abort", abortHandler);
    try {
        return await Promise.race(abortablePromiseBuilders.map((p) => p({ abortSignal: aborter.signal })));
    }
    finally {
        aborter.abort();
        options?.abortSignal?.removeEventListener("abort", abortHandler);
    }
}
//# sourceMappingURL=aborterUtils.js.map

/***/ },

/***/ 2181
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAbortablePromise: () => (/* binding */ createAbortablePromise)
/* harmony export */ });
/* harmony import */ var _azure_abort_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2182);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Creates an abortable promise.
 * @param buildPromise - A function that takes the resolve and reject functions as parameters.
 * @param options - The options for the abortable promise.
 * @returns A promise that can be aborted.
 */
function createAbortablePromise(buildPromise, options) {
    const { cleanupBeforeAbort, abortSignal, abortErrorMsg } = options ?? {};
    return new Promise((resolve, reject) => {
        function rejectOnAbort() {
            reject(new _azure_abort_controller__WEBPACK_IMPORTED_MODULE_0__.AbortError(abortErrorMsg ?? "The operation was aborted."));
        }
        function removeListeners() {
            abortSignal?.removeEventListener("abort", onAbort);
        }
        function onAbort() {
            cleanupBeforeAbort?.();
            removeListeners();
            rejectOnAbort();
        }
        if (abortSignal?.aborted) {
            return rejectOnAbort();
        }
        try {
            buildPromise((x) => {
                removeListeners();
                resolve(x);
            }, (x) => {
                removeListeners();
                reject(x);
            });
        }
        catch (err) {
            reject(err);
        }
        abortSignal?.addEventListener("abort", onAbort);
    });
}
//# sourceMappingURL=createAbortablePromise.js.map

/***/ },

/***/ 2184
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateRetryDelay: () => (/* binding */ calculateRetryDelay),
/* harmony export */   delay: () => (/* binding */ delay)
/* harmony export */ });
/* harmony import */ var _createAbortablePromise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2181);
/* harmony import */ var _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2178);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


const StandardAbortMessage = "The delay was aborted.";
/**
 * A wrapper for setTimeout that resolves a promise after timeInMs milliseconds.
 * @param timeInMs - The number of milliseconds to be delayed.
 * @param options - The options for delay - currently abort options
 * @returns Promise that is resolved after timeInMs
 */
function delay(timeInMs, options) {
    let token;
    const { abortSignal, abortErrorMsg } = options ?? {};
    return (0,_createAbortablePromise_js__WEBPACK_IMPORTED_MODULE_0__.createAbortablePromise)((resolve) => {
        token = setTimeout(resolve, timeInMs);
    }, {
        cleanupBeforeAbort: () => clearTimeout(token),
        abortSignal,
        abortErrorMsg: abortErrorMsg ?? StandardAbortMessage,
    });
}
/**
 * Calculates the delay interval for retry attempts using exponential delay with jitter.
 * @param retryAttempt - The current retry attempt number.
 * @param config - The exponential retry configuration.
 * @returns An object containing the calculated retry delay.
 */
function calculateRetryDelay(retryAttempt, config) {
    // Exponentially increase the delay each time
    const exponentialDelay = config.retryDelayInMs * Math.pow(2, retryAttempt);
    // Don't let the delay exceed the maximum
    const clampedDelay = Math.min(config.maxRetryDelayInMs, exponentialDelay);
    // Allow the final value to have some "jitter" (within 50% of the delay size) so
    // that retries across multiple clients don't occur simultaneously.
    const retryAfterInMs = clampedDelay / 2 + (0,_typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_1__.getRandomIntegerInclusive)(0, clampedDelay / 2);
    return { retryAfterInMs };
}
//# sourceMappingURL=delay.js.map

/***/ },

/***/ 2185
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getErrorMessage: () => (/* binding */ getErrorMessage)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2178);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Given what is thought to be an error object, return the message if possible.
 * If the message is missing, returns a stringified version of the input.
 * @param e - Something thrown from a try block
 * @returns The error message or a string of the input
 */
function getErrorMessage(e) {
    if ((0,_typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isError)(e)) {
        return e.message;
    }
    else {
        let stringified;
        try {
            if (typeof e === "object" && e) {
                stringified = JSON.stringify(e);
            }
            else {
                stringified = String(e);
            }
        }
        catch (err) {
            stringified = "[unable to stringify input]";
        }
        return `Unknown error ${stringified}`;
    }
}
//# sourceMappingURL=error.js.map

/***/ },

/***/ 2177
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateRetryDelay: () => (/* binding */ calculateRetryDelay),
/* harmony export */   cancelablePromiseRace: () => (/* reexport safe */ _aborterUtils_js__WEBPACK_IMPORTED_MODULE_1__.cancelablePromiseRace),
/* harmony export */   computeSha256Hash: () => (/* binding */ computeSha256Hash),
/* harmony export */   computeSha256Hmac: () => (/* binding */ computeSha256Hmac),
/* harmony export */   createAbortablePromise: () => (/* reexport safe */ _createAbortablePromise_js__WEBPACK_IMPORTED_MODULE_2__.createAbortablePromise),
/* harmony export */   delay: () => (/* reexport safe */ _delay_js__WEBPACK_IMPORTED_MODULE_3__.delay),
/* harmony export */   getErrorMessage: () => (/* reexport safe */ _error_js__WEBPACK_IMPORTED_MODULE_4__.getErrorMessage),
/* harmony export */   getRandomIntegerInclusive: () => (/* binding */ getRandomIntegerInclusive),
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   isBun: () => (/* binding */ isBun),
/* harmony export */   isDefined: () => (/* reexport safe */ _typeGuards_js__WEBPACK_IMPORTED_MODULE_5__.isDefined),
/* harmony export */   isDeno: () => (/* binding */ isDeno),
/* harmony export */   isError: () => (/* binding */ isError),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isNodeLike: () => (/* binding */ isNodeLike),
/* harmony export */   isNodeRuntime: () => (/* binding */ isNodeRuntime),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isObjectWithProperties: () => (/* reexport safe */ _typeGuards_js__WEBPACK_IMPORTED_MODULE_5__.isObjectWithProperties),
/* harmony export */   isReactNative: () => (/* binding */ isReactNative),
/* harmony export */   isWebWorker: () => (/* binding */ isWebWorker),
/* harmony export */   objectHasProperty: () => (/* reexport safe */ _typeGuards_js__WEBPACK_IMPORTED_MODULE_5__.objectHasProperty),
/* harmony export */   randomUUID: () => (/* binding */ randomUUID),
/* harmony export */   stringToUint8Array: () => (/* binding */ stringToUint8Array),
/* harmony export */   uint8ArrayToString: () => (/* binding */ uint8ArrayToString)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2178);
/* harmony import */ var _aborterUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2180);
/* harmony import */ var _createAbortablePromise_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2181);
/* harmony import */ var _delay_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2184);
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2185);
/* harmony import */ var _typeGuards_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2186);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.






/**
 * Calculates the delay interval for retry attempts using exponential delay with jitter.
 *
 * @param retryAttempt - The current retry attempt number.
 *
 * @param config - The exponential retry configuration.
 *
 * @returns An object containing the calculated retry delay.
 */
function calculateRetryDelay(retryAttempt, config) {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.calculateRetryDelay(retryAttempt, config);
}
/**
 * Generates a SHA-256 hash.
 *
 * @param content - The data to be included in the hash.
 *
 * @param encoding - The textual encoding to use for the returned hash.
 */
function computeSha256Hash(content, encoding) {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.computeSha256Hash(content, encoding);
}
/**
 * Generates a SHA-256 HMAC signature.
 *
 * @param key - The HMAC key represented as a base64 string, used to generate the cryptographic HMAC hash.
 *
 * @param stringToSign - The data to be signed.
 *
 * @param encoding - The textual encoding to use for the returned HMAC digest.
 */
function computeSha256Hmac(key, stringToSign, encoding) {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.computeSha256Hmac(key, stringToSign, encoding);
}
/**
 * Returns a random integer value between a lower and upper bound, inclusive of both bounds. Note that this uses Math.random and isn't secure. If you need to use this for any kind of security purpose, find a better source of random.
 *
 * @param min - The smallest integer value allowed.
 *
 * @param max - The largest integer value allowed.
 */
function getRandomIntegerInclusive(min, max) {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.getRandomIntegerInclusive(min, max);
}
/**
 * Typeguard for an error object shape (has name and message)
 *
 * @param e - Something caught by a catch clause.
 */
function isError(e) {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isError(e);
}
/**
 * Helper to determine when an input is a generic JS object.
 *
 * @returns true when input is an object type that is not null, Array, RegExp, or Date.
 */
function isObject(input) {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isObject(input);
}
/**
 * Generated Universally Unique Identifier
 *
 * @returns RFC4122 v4 UUID.
 */
function randomUUID() {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.randomUUID();
}
/**
 * A constant that indicates whether the environment the code is running is a Web Browser.
 */
const isBrowser = _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isBrowser;
/**
 * A constant that indicates whether the environment the code is running is Bun.sh.
 */
const isBun = _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isBun;
/**
 * A constant that indicates whether the environment the code is running is Deno.
 */
const isDeno = _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isDeno;
/**
 * A constant that indicates whether the environment the code is running is a Node.js compatible environment.
 *
 * @deprecated
 *
 * Use `isNodeLike` instead.
 */
const isNode = _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isNodeLike;
/**
 * A constant that indicates whether the environment the code is running is a Node.js compatible environment.
 */
const isNodeLike = _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isNodeLike;
/**
 * A constant that indicates whether the environment the code is running is Node.JS.
 */
const isNodeRuntime = _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isNodeRuntime;
/**
 * A constant that indicates whether the environment the code is running is in React-Native.
 */
const isReactNative = _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isReactNative;
/**
 * A constant that indicates whether the environment the code is running is a Web Worker.
 */
const isWebWorker = _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.isWebWorker;
/**
 * The helper that transforms bytes with specific character encoding into string
 * @param bytes - the uint8array bytes
 * @param format - the format we use to encode the byte
 * @returns a string of the encoded string
 */
function uint8ArrayToString(bytes, format) {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.uint8ArrayToString(bytes, format);
}
/**
 * The helper that transforms string to specific character encoded bytes array.
 * @param value - the string to be converted
 * @param format - the format we use to decode the value
 * @returns a uint8array
 */
function stringToUint8Array(value, format) {
    return _typespec_ts_http_runtime_internal_util__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array(value, format);
}
//# sourceMappingURL=index.js.map

/***/ },

/***/ 2186
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isDefined: () => (/* binding */ isDefined),
/* harmony export */   isObjectWithProperties: () => (/* binding */ isObjectWithProperties),
/* harmony export */   objectHasProperty: () => (/* binding */ objectHasProperty)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Helper TypeGuard that checks if something is defined or not.
 * @param thing - Anything
 */
function isDefined(thing) {
    return typeof thing !== "undefined" && thing !== null;
}
/**
 * Helper TypeGuard that checks if the input is an object with the specified properties.
 * @param thing - Anything.
 * @param properties - The name of the properties that should appear in the object.
 */
function isObjectWithProperties(thing, properties) {
    if (!isDefined(thing) || typeof thing !== "object") {
        return false;
    }
    for (const property of properties) {
        if (!objectHasProperty(thing, property)) {
            return false;
        }
    }
    return true;
}
/**
 * Helper TypeGuard that checks if the input is an object with the specified property.
 * @param thing - Any object.
 * @param property - The name of the property that should appear in the object.
 */
function objectHasProperty(thing, property) {
    return (isDefined(thing) && typeof thing === "object" && property in thing);
}
//# sourceMappingURL=typeGuards.js.map

/***/ },

/***/ 2164
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AzureLogger: () => (/* binding */ AzureLogger),
/* harmony export */   createClientLogger: () => (/* binding */ createClientLogger),
/* harmony export */   getLogLevel: () => (/* binding */ getLogLevel),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _typespec_ts_http_runtime_internal_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2165);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const context = (0,_typespec_ts_http_runtime_internal_logger__WEBPACK_IMPORTED_MODULE_0__.createLoggerContext)({
    logLevelEnvVarName: "AZURE_LOG_LEVEL",
    namespace: "azure",
});
/**
 * The AzureLogger provides a mechanism for overriding where logs are output to.
 * By default, logs are sent to stderr.
 * Override the `log` method to redirect logs to another location.
 */
const AzureLogger = context.logger;
/**
 * Immediately enables logging at the specified log level. If no level is specified, logging is disabled.
 * @param level - The log level to enable for logging.
 * Options from most verbose to least verbose are:
 * - verbose
 * - info
 * - warning
 * - error
 */
function setLogLevel(level) {
    context.setLogLevel(level);
}
/**
 * Retrieves the currently specified log level.
 */
function getLogLevel() {
    return context.getLogLevel();
}
/**
 * Creates a logger for use by the Azure SDKs that inherits from `AzureLogger`.
 * @param namespace - The name of the SDK package.
 * @hidden
 */
function createClientLogger(namespace) {
    return context.createClientLogger(namespace);
}
//# sourceMappingURL=index.js.map

/***/ },

/***/ 2105
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * This error is thrown when an asynchronous operation has been aborted.
 * Check for this error by testing the `name` that the name property of the
 * error matches `"AbortError"`.
 *
 * @example
 * ```ts snippet:ReadmeSampleAbortError
 * import { AbortError } from "@typespec/ts-http-runtime";
 *
 * async function doAsyncWork(options: { abortSignal: AbortSignal }): Promise<void> {
 *   if (options.abortSignal.aborted) {
 *     throw new AbortError();
 *   }
 *
 *   // do async work
 * }
 *
 * const controller = new AbortController();
 * controller.abort();
 *
 * try {
 *   doAsyncWork({ abortSignal: controller.signal });
 * } catch (e) {
 *   if (e instanceof Error && e.name === "AbortError") {
 *     // handle abort error here.
 *   }
 * }
 * ```
 */
class AbortError extends Error {
    constructor(message) {
        super(message);
        this.name = "AbortError";
    }
}
//# sourceMappingURL=AbortError.js.map

/***/ },

/***/ 2150
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isApiKeyCredential: () => (/* binding */ isApiKeyCredential),
/* harmony export */   isBasicCredential: () => (/* binding */ isBasicCredential),
/* harmony export */   isBearerTokenCredential: () => (/* binding */ isBearerTokenCredential),
/* harmony export */   isOAuth2TokenCredential: () => (/* binding */ isOAuth2TokenCredential)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Type guard to check if a credential is an OAuth2 token credential.
 */
function isOAuth2TokenCredential(credential) {
    return "getOAuth2Token" in credential;
}
/**
 * Type guard to check if a credential is a Bearer token credential.
 */
function isBearerTokenCredential(credential) {
    return "getBearerToken" in credential;
}
/**
 * Type guard to check if a credential is a Basic auth credential.
 */
function isBasicCredential(credential) {
    return "username" in credential && "password" in credential;
}
/**
 * Type guard to check if a credential is an API key credential.
 */
function isApiKeyCredential(credential) {
    return "key" in credential;
}
//# sourceMappingURL=credentials.js.map

/***/ },

/***/ 2111
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

//# sourceMappingURL=oauth2Flows.js.map

/***/ },

/***/ 2110
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

//# sourceMappingURL=schemes.js.map

/***/ },

/***/ 2149
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiVersionPolicy: () => (/* binding */ apiVersionPolicy),
/* harmony export */   apiVersionPolicyName: () => (/* binding */ apiVersionPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const apiVersionPolicyName = "ApiVersionPolicy";
/**
 * Creates a policy that sets the apiVersion as a query parameter on every request
 * @param options - Client options
 * @returns Pipeline policy that sets the apiVersion as a query parameter on every request
 */
function apiVersionPolicy(options) {
    return {
        name: apiVersionPolicyName,
        sendRequest: (req, next) => {
            // Use the apiVesion defined in request url directly
            // Append one if there is no apiVesion and we have one at client options
            const url = new URL(req.url);
            if (!url.searchParams.get("api-version") && options.apiVersion) {
                req.url = `${req.url}${Array.from(url.searchParams.keys()).length > 0 ? "&" : "?"}api-version=${options.apiVersion}`;
            }
            return next(req);
        },
    };
}
//# sourceMappingURL=apiVersionPolicy.js.map

/***/ },

/***/ 2125
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDefaultPipeline: () => (/* binding */ createDefaultPipeline),
/* harmony export */   getCachedDefaultHttpsClient: () => (/* binding */ getCachedDefaultHttpsClient)
/* harmony export */ });
/* harmony import */ var _defaultHttpClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2121);
/* harmony import */ var _createPipelineFromOptions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2126);
/* harmony import */ var _apiVersionPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2149);
/* harmony import */ var _auth_credentials_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2150);
/* harmony import */ var _policies_auth_apiKeyAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2151);
/* harmony import */ var _policies_auth_basicAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2153);
/* harmony import */ var _policies_auth_bearerAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2154);
/* harmony import */ var _policies_auth_oauth2AuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2155);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.








let cachedHttpClient;
/**
 * Creates a default rest pipeline to re-use accross Rest Level Clients
 */
function createDefaultPipeline(options = {}) {
    const pipeline = (0,_createPipelineFromOptions_js__WEBPACK_IMPORTED_MODULE_1__.createPipelineFromOptions)(options);
    pipeline.addPolicy((0,_apiVersionPolicy_js__WEBPACK_IMPORTED_MODULE_2__.apiVersionPolicy)(options));
    const { credential, authSchemes, allowInsecureConnection } = options;
    if (credential) {
        if ((0,_auth_credentials_js__WEBPACK_IMPORTED_MODULE_3__.isApiKeyCredential)(credential)) {
            pipeline.addPolicy((0,_policies_auth_apiKeyAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_4__.apiKeyAuthenticationPolicy)({ authSchemes, credential, allowInsecureConnection }));
        }
        else if ((0,_auth_credentials_js__WEBPACK_IMPORTED_MODULE_3__.isBasicCredential)(credential)) {
            pipeline.addPolicy((0,_policies_auth_basicAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_5__.basicAuthenticationPolicy)({ authSchemes, credential, allowInsecureConnection }));
        }
        else if ((0,_auth_credentials_js__WEBPACK_IMPORTED_MODULE_3__.isBearerTokenCredential)(credential)) {
            pipeline.addPolicy((0,_policies_auth_bearerAuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_6__.bearerAuthenticationPolicy)({ authSchemes, credential, allowInsecureConnection }));
        }
        else if ((0,_auth_credentials_js__WEBPACK_IMPORTED_MODULE_3__.isOAuth2TokenCredential)(credential)) {
            pipeline.addPolicy((0,_policies_auth_oauth2AuthenticationPolicy_js__WEBPACK_IMPORTED_MODULE_7__.oauth2AuthenticationPolicy)({ authSchemes, credential, allowInsecureConnection }));
        }
    }
    return pipeline;
}
function getCachedDefaultHttpsClient() {
    if (!cachedHttpClient) {
        cachedHttpClient = (0,_defaultHttpClient_js__WEBPACK_IMPORTED_MODULE_0__.createDefaultHttpClient)();
    }
    return cachedHttpClient;
}
//# sourceMappingURL=clientHelpers.js.map

/***/ },

/***/ 2124
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getClient: () => (/* binding */ getClient)
/* harmony export */ });
/* harmony import */ var _clientHelpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2125);
/* harmony import */ var _sendRequest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2156);
/* harmony import */ var _urlHelpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2158);
/* harmony import */ var _util_checkEnvironment_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2142);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.




/**
 * Creates a client with a default pipeline
 * @param endpoint - Base endpoint for the client
 * @param credentials - Credentials to authenticate the requests
 * @param options - Client options
 */
function getClient(endpoint, clientOptions = {}) {
    const pipeline = clientOptions.pipeline ?? (0,_clientHelpers_js__WEBPACK_IMPORTED_MODULE_0__.createDefaultPipeline)(clientOptions);
    if (clientOptions.additionalPolicies?.length) {
        for (const { policy, position } of clientOptions.additionalPolicies) {
            // Sign happens after Retry and is commonly needed to occur
            // before policies that intercept post-retry.
            const afterPhase = position === "perRetry" ? "Sign" : undefined;
            pipeline.addPolicy(policy, {
                afterPhase,
            });
        }
    }
    const { allowInsecureConnection, httpClient } = clientOptions;
    const endpointUrl = clientOptions.endpoint ?? endpoint;
    const client = (path, ...args) => {
        const getUrl = (requestOptions) => (0,_urlHelpers_js__WEBPACK_IMPORTED_MODULE_2__.buildRequestUrl)(endpointUrl, path, args, { allowInsecureConnection, ...requestOptions });
        return {
            get: (requestOptions = {}) => {
                return buildOperation("GET", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            post: (requestOptions = {}) => {
                return buildOperation("POST", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            put: (requestOptions = {}) => {
                return buildOperation("PUT", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            patch: (requestOptions = {}) => {
                return buildOperation("PATCH", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            delete: (requestOptions = {}) => {
                return buildOperation("DELETE", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            head: (requestOptions = {}) => {
                return buildOperation("HEAD", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            options: (requestOptions = {}) => {
                return buildOperation("OPTIONS", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
            trace: (requestOptions = {}) => {
                return buildOperation("TRACE", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection, httpClient);
            },
        };
    };
    return {
        path: client,
        pathUnchecked: client,
        pipeline,
    };
}
function buildOperation(method, url, pipeline, options, allowInsecureConnection, httpClient) {
    allowInsecureConnection = options.allowInsecureConnection ?? allowInsecureConnection;
    return {
        then: function (onFulfilled, onrejected) {
            return (0,_sendRequest_js__WEBPACK_IMPORTED_MODULE_1__.sendRequest)(method, url, pipeline, { ...options, allowInsecureConnection }, httpClient).then(onFulfilled, onrejected);
        },
        async asBrowserStream() {
            if (_util_checkEnvironment_js__WEBPACK_IMPORTED_MODULE_3__.isNodeLike) {
                throw new Error("`asBrowserStream` is supported only in the browser environment. Use `asNodeStream` instead to obtain the response body stream. If you require a Web stream of the response in Node, consider using `Readable.toWeb` on the result of `asNodeStream`.");
            }
            else {
                return (0,_sendRequest_js__WEBPACK_IMPORTED_MODULE_1__.sendRequest)(method, url, pipeline, { ...options, allowInsecureConnection, responseAsStream: true }, httpClient);
            }
        },
        async asNodeStream() {
            if (_util_checkEnvironment_js__WEBPACK_IMPORTED_MODULE_3__.isNodeLike) {
                return (0,_sendRequest_js__WEBPACK_IMPORTED_MODULE_1__.sendRequest)(method, url, pipeline, { ...options, allowInsecureConnection, responseAsStream: true }, httpClient);
            }
            else {
                throw new Error("`isNodeStream` is not supported in the browser environment. Use `asBrowserStream` to obtain the response body stream.");
            }
        },
    };
}
//# sourceMappingURL=getClient.js.map

/***/ },

/***/ 2157
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildBodyPart: () => (/* binding */ buildBodyPart),
/* harmony export */   buildMultipartBody: () => (/* binding */ buildMultipartBody)
/* harmony export */ });
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2115);
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2109);
/* harmony import */ var _util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2120);
/* harmony import */ var _util_typeGuards_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2147);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.




/**
 * Get value of a header in the part descriptor ignoring case
 */
function getHeaderValue(descriptor, headerName) {
    if (descriptor.headers) {
        const actualHeaderName = Object.keys(descriptor.headers).find((x) => x.toLowerCase() === headerName.toLowerCase());
        if (actualHeaderName) {
            return descriptor.headers[actualHeaderName];
        }
    }
    return undefined;
}
function getPartContentType(descriptor) {
    const contentTypeHeader = getHeaderValue(descriptor, "content-type");
    if (contentTypeHeader) {
        return contentTypeHeader;
    }
    // Special value of null means content type is to be omitted
    if (descriptor.contentType === null) {
        return undefined;
    }
    if (descriptor.contentType) {
        return descriptor.contentType;
    }
    const { body } = descriptor;
    if (body === null || body === undefined) {
        return undefined;
    }
    if (typeof body === "string" || typeof body === "number" || typeof body === "boolean") {
        return "text/plain; charset=UTF-8";
    }
    if (body instanceof Blob) {
        return body.type || "application/octet-stream";
    }
    if ((0,_util_typeGuards_js__WEBPACK_IMPORTED_MODULE_3__.isBinaryBody)(body)) {
        return "application/octet-stream";
    }
    // arbitrary non-text object -> generic JSON content type by default. We will try to JSON.stringify the body.
    return "application/json";
}
/**
 * Enclose value in quotes and escape special characters, for use in the Content-Disposition header
 */
function escapeDispositionField(value) {
    return JSON.stringify(value);
}
function getContentDisposition(descriptor) {
    const contentDispositionHeader = getHeaderValue(descriptor, "content-disposition");
    if (contentDispositionHeader) {
        return contentDispositionHeader;
    }
    if (descriptor.dispositionType === undefined &&
        descriptor.name === undefined &&
        descriptor.filename === undefined) {
        return undefined;
    }
    const dispositionType = descriptor.dispositionType ?? "form-data";
    let disposition = dispositionType;
    if (descriptor.name) {
        disposition += `; name=${escapeDispositionField(descriptor.name)}`;
    }
    let filename = undefined;
    if (descriptor.filename) {
        filename = descriptor.filename;
    }
    else if (typeof File !== "undefined" && descriptor.body instanceof File) {
        const filenameFromFile = descriptor.body.name;
        if (filenameFromFile !== "") {
            filename = filenameFromFile;
        }
    }
    if (filename) {
        disposition += `; filename=${escapeDispositionField(filename)}`;
    }
    return disposition;
}
function normalizeBody(body, contentType) {
    if (body === undefined) {
        // zero-length body
        return new Uint8Array([]);
    }
    // binary and primitives should go straight on the wire regardless of content type
    if ((0,_util_typeGuards_js__WEBPACK_IMPORTED_MODULE_3__.isBinaryBody)(body)) {
        return body;
    }
    if (typeof body === "string" || typeof body === "number" || typeof body === "boolean") {
        return (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_2__.stringToUint8Array)(String(body), "utf-8");
    }
    // stringify objects for JSON-ish content types e.g. application/json, application/merge-patch+json, application/vnd.oci.manifest.v1+json, application.json; charset=UTF-8
    if (contentType && /application\/(.+\+)?json(;.+)?/i.test(String(contentType))) {
        return (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_2__.stringToUint8Array)(JSON.stringify(body), "utf-8");
    }
    throw new _restError_js__WEBPACK_IMPORTED_MODULE_0__.RestError(`Unsupported body/content-type combination: ${body}, ${contentType}`);
}
function buildBodyPart(descriptor) {
    const contentType = getPartContentType(descriptor);
    const contentDisposition = getContentDisposition(descriptor);
    const headers = (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__.createHttpHeaders)(descriptor.headers ?? {});
    if (contentType) {
        headers.set("content-type", contentType);
    }
    if (contentDisposition) {
        headers.set("content-disposition", contentDisposition);
    }
    const body = normalizeBody(descriptor.body, contentType);
    return {
        headers,
        body,
    };
}
function buildMultipartBody(parts) {
    return { parts: parts.map(buildBodyPart) };
}
//# sourceMappingURL=multipart.js.map

/***/ },

/***/ 2159
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   operationOptionsToRequestParameters: () => (/* binding */ operationOptionsToRequestParameters)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Helper function to convert OperationOptions to RequestParameters
 * @param options - the options that are used by Modular layer to send the request
 * @returns the result of the conversion in RequestParameters of RLC layer
 */
function operationOptionsToRequestParameters(options) {
    return {
        allowInsecureConnection: options.requestOptions?.allowInsecureConnection,
        timeout: options.requestOptions?.timeout,
        skipUrlEncoding: options.requestOptions?.skipUrlEncoding,
        abortSignal: options.abortSignal,
        onUploadProgress: options.requestOptions?.onUploadProgress,
        onDownloadProgress: options.requestOptions?.onDownloadProgress,
        headers: { ...options.requestOptions?.headers },
        onResponse: options.onResponse,
    };
}
//# sourceMappingURL=operationOptionHelpers.js.map

/***/ },

/***/ 2160
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRestError: () => (/* binding */ createRestError)
/* harmony export */ });
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2115);
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2109);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


function createRestError(messageOrResponse, response) {
    const resp = typeof messageOrResponse === "string" ? response : messageOrResponse;
    const internalError = resp.body?.error ?? resp.body;
    const message = typeof messageOrResponse === "string"
        ? messageOrResponse
        : (internalError?.message ?? `Unexpected status code: ${resp.status}`);
    return new _restError_js__WEBPACK_IMPORTED_MODULE_0__.RestError(message, {
        statusCode: statusCodeToNumber(resp.status),
        code: internalError?.code,
        request: resp.request,
        response: toPipelineResponse(resp),
    });
}
function toPipelineResponse(response) {
    return {
        headers: (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__.createHttpHeaders)(response.headers),
        request: response.request,
        status: statusCodeToNumber(response.status) ?? -1,
    };
}
function statusCodeToNumber(statusCode) {
    const status = Number.parseInt(statusCode);
    return Number.isNaN(status) ? undefined : status;
}
//# sourceMappingURL=restError.js.map

/***/ },

/***/ 2156
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendRequest: () => (/* binding */ sendRequest)
/* harmony export */ });
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2115);
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2109);
/* harmony import */ var _pipelineRequest_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2112);
/* harmony import */ var _clientHelpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2125);
/* harmony import */ var _util_typeGuards_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2147);
/* harmony import */ var _multipart_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2157);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.






/**
 * Helper function to send request used by the client
 * @param method - method to use to send the request
 * @param url - url to send the request to
 * @param pipeline - pipeline with the policies to run when sending the request
 * @param options - request options
 * @param customHttpClient - a custom HttpClient to use when making the request
 * @returns returns and HttpResponse
 */
async function sendRequest(method, url, pipeline, options = {}, customHttpClient) {
    const httpClient = customHttpClient ?? (0,_clientHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getCachedDefaultHttpsClient)();
    const request = buildPipelineRequest(method, url, options);
    try {
        const response = await pipeline.sendRequest(httpClient, request);
        const headers = response.headers.toJSON();
        const stream = response.readableStreamBody ?? response.browserStreamBody;
        const parsedBody = options.responseAsStream || stream !== undefined ? undefined : getResponseBody(response);
        const body = stream ?? parsedBody;
        if (options?.onResponse) {
            options.onResponse({ ...response, request, rawHeaders: headers, parsedBody });
        }
        return {
            request,
            headers,
            status: `${response.status}`,
            body,
        };
    }
    catch (e) {
        if ((0,_restError_js__WEBPACK_IMPORTED_MODULE_0__.isRestError)(e) && e.response && options.onResponse) {
            const { response } = e;
            const rawHeaders = response.headers.toJSON();
            // UNBRANDED DIFFERENCE: onResponse callback does not have a second __legacyError property
            options?.onResponse({ ...response, request, rawHeaders }, e);
        }
        throw e;
    }
}
/**
 * Function to determine the request content type
 * @param options - request options InternalRequestParameters
 * @returns returns the content-type
 */
function getRequestContentType(options = {}) {
    return (options.contentType ??
        options.headers?.["content-type"] ??
        getContentType(options.body));
}
/**
 * Function to determine the content-type of a body
 * this is used if an explicit content-type is not provided
 * @param body - body in the request
 * @returns returns the content-type
 */
function getContentType(body) {
    if (ArrayBuffer.isView(body)) {
        return "application/octet-stream";
    }
    if (typeof body === "string") {
        try {
            JSON.parse(body);
            return "application/json";
        }
        catch (error) {
            // If we fail to parse the body, it is not json
            return undefined;
        }
    }
    // By default return json
    return "application/json";
}
function buildPipelineRequest(method, url, options = {}) {
    const requestContentType = getRequestContentType(options);
    const { body, multipartBody } = getRequestBody(options.body, requestContentType);
    const hasContent = body !== undefined || multipartBody !== undefined;
    const headers = (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_1__.createHttpHeaders)({
        ...(options.headers ? options.headers : {}),
        accept: options.accept ?? options.headers?.accept ?? "application/json",
        ...(hasContent &&
            requestContentType && {
            "content-type": requestContentType,
        }),
    });
    return (0,_pipelineRequest_js__WEBPACK_IMPORTED_MODULE_2__.createPipelineRequest)({
        url,
        method,
        body,
        multipartBody,
        headers,
        allowInsecureConnection: options.allowInsecureConnection,
        abortSignal: options.abortSignal,
        onUploadProgress: options.onUploadProgress,
        onDownloadProgress: options.onDownloadProgress,
        timeout: options.timeout,
        enableBrowserStreams: true,
        streamResponseStatusCodes: options.responseAsStream
            ? new Set([Number.POSITIVE_INFINITY])
            : undefined,
    });
}
/**
 * Prepares the body before sending the request
 */
function getRequestBody(body, contentType = "") {
    if (body === undefined) {
        return { body: undefined };
    }
    if (typeof FormData !== "undefined" && body instanceof FormData) {
        return { body };
    }
    if ((0,_util_typeGuards_js__WEBPACK_IMPORTED_MODULE_4__.isReadableStream)(body)) {
        return { body };
    }
    if (ArrayBuffer.isView(body)) {
        return { body: body instanceof Uint8Array ? body : JSON.stringify(body) };
    }
    const firstType = contentType.split(";")[0];
    switch (firstType) {
        case "application/json":
            return { body: JSON.stringify(body) };
        case "multipart/form-data":
            if (Array.isArray(body)) {
                return { multipartBody: (0,_multipart_js__WEBPACK_IMPORTED_MODULE_5__.buildMultipartBody)(body) };
            }
            return { body: JSON.stringify(body) };
        case "text/plain":
            return { body: String(body) };
        default:
            if (typeof body === "string") {
                return { body };
            }
            return { body: JSON.stringify(body) };
    }
}
/**
 * Prepares the response body
 */
function getResponseBody(response) {
    // Set the default response type
    const contentType = response.headers.get("content-type") ?? "";
    const firstType = contentType.split(";")[0];
    const bodyToParse = response.bodyAsText ?? "";
    if (firstType === "text/plain") {
        return String(bodyToParse);
    }
    // Default to "application/json" and fallback to string;
    try {
        return bodyToParse ? JSON.parse(bodyToParse) : undefined;
    }
    catch (error) {
        // If we were supposed to get a JSON object and failed to
        // parse, throw a parse error
        if (firstType === "application/json") {
            throw createParseError(response, error);
        }
        // We are not sure how to handle the response so we return it as
        // plain text.
        return String(bodyToParse);
    }
}
function createParseError(response, err) {
    const msg = `Error "${err}" occurred while parsing the response body - ${response.bodyAsText}.`;
    const errCode = err.code ?? _restError_js__WEBPACK_IMPORTED_MODULE_0__.RestError.PARSE_ERROR;
    return new _restError_js__WEBPACK_IMPORTED_MODULE_0__.RestError(msg, {
        code: errCode,
        statusCode: response.status,
        request: response.request,
        response: response,
    });
}
//# sourceMappingURL=sendRequest.js.map

/***/ },

/***/ 2158
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildBaseUrl: () => (/* binding */ buildBaseUrl),
/* harmony export */   buildRequestUrl: () => (/* binding */ buildRequestUrl),
/* harmony export */   replaceAll: () => (/* binding */ replaceAll)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
function isQueryParameterWithOptions(x) {
    const value = x.value;
    return (value !== undefined && value.toString !== undefined && typeof value.toString === "function");
}
/**
 * Builds the request url, filling in query and path parameters
 * @param endpoint - base url which can be a template url
 * @param routePath - path to append to the endpoint
 * @param pathParameters - values of the path parameters
 * @param options - request parameters including query parameters
 * @returns a full url with path and query parameters
 */
function buildRequestUrl(endpoint, routePath, pathParameters, options = {}) {
    if (routePath.startsWith("https://") || routePath.startsWith("http://")) {
        return routePath;
    }
    endpoint = buildBaseUrl(endpoint, options);
    routePath = buildRoutePath(routePath, pathParameters, options);
    const requestUrl = appendQueryParams(`${endpoint}/${routePath}`, options);
    const url = new URL(requestUrl);
    return (url
        .toString()
        // Remove double forward slashes
        .replace(/([^:]\/)\/+/g, "$1"));
}
function getQueryParamValue(key, allowReserved, style, param) {
    let separator;
    if (style === "pipeDelimited") {
        separator = "|";
    }
    else if (style === "spaceDelimited") {
        separator = "%20";
    }
    else {
        separator = ",";
    }
    let paramValues;
    if (Array.isArray(param)) {
        paramValues = param;
    }
    else if (typeof param === "object" && param.toString === Object.prototype.toString) {
        // If the parameter is an object without a custom toString implementation (e.g. a Date),
        // then we should deconstruct the object into an array [key1, value1, key2, value2, ...].
        paramValues = Object.entries(param).flat();
    }
    else {
        paramValues = [param];
    }
    const value = paramValues
        .map((p) => {
        if (p === null || p === undefined) {
            return "";
        }
        if (!p.toString || typeof p.toString !== "function") {
            throw new Error(`Query parameters must be able to be represented as string, ${key} can't`);
        }
        const rawValue = p.toISOString !== undefined ? p.toISOString() : p.toString();
        return allowReserved ? rawValue : encodeURIComponent(rawValue);
    })
        .join(separator);
    return `${allowReserved ? key : encodeURIComponent(key)}=${value}`;
}
function appendQueryParams(url, options = {}) {
    if (!options.queryParameters) {
        return url;
    }
    const parsedUrl = new URL(url);
    const queryParams = options.queryParameters;
    const paramStrings = [];
    for (const key of Object.keys(queryParams)) {
        const param = queryParams[key];
        if (param === undefined || param === null) {
            continue;
        }
        const hasMetadata = isQueryParameterWithOptions(param);
        const rawValue = hasMetadata ? param.value : param;
        const explode = hasMetadata ? (param.explode ?? false) : false;
        const style = hasMetadata && param.style ? param.style : "form";
        if (explode) {
            if (Array.isArray(rawValue)) {
                for (const item of rawValue) {
                    paramStrings.push(getQueryParamValue(key, options.skipUrlEncoding ?? false, style, item));
                }
            }
            else if (typeof rawValue === "object") {
                // For object explode, the name of the query parameter is ignored and we use the object key instead
                for (const [actualKey, value] of Object.entries(rawValue)) {
                    paramStrings.push(getQueryParamValue(actualKey, options.skipUrlEncoding ?? false, style, value));
                }
            }
            else {
                // Explode doesn't really make sense for primitives
                throw new Error("explode can only be set to true for objects and arrays");
            }
        }
        else {
            paramStrings.push(getQueryParamValue(key, options.skipUrlEncoding ?? false, style, rawValue));
        }
    }
    if (parsedUrl.search !== "") {
        parsedUrl.search += "&";
    }
    parsedUrl.search += paramStrings.join("&");
    return parsedUrl.toString();
}
function buildBaseUrl(endpoint, options) {
    if (!options.pathParameters) {
        return endpoint;
    }
    const pathParams = options.pathParameters;
    for (const [key, param] of Object.entries(pathParams)) {
        if (param === undefined || param === null) {
            throw new Error(`Path parameters ${key} must not be undefined or null`);
        }
        if (!param.toString || typeof param.toString !== "function") {
            throw new Error(`Path parameters must be able to be represented as string, ${key} can't`);
        }
        let value = param.toISOString !== undefined ? param.toISOString() : String(param);
        if (!options.skipUrlEncoding) {
            value = encodeURIComponent(param);
        }
        endpoint = replaceAll(endpoint, `{${key}}`, value) ?? "";
    }
    return endpoint;
}
function buildRoutePath(routePath, pathParameters, options = {}) {
    for (const pathParam of pathParameters) {
        const allowReserved = typeof pathParam === "object" && (pathParam.allowReserved ?? false);
        let value = typeof pathParam === "object" ? pathParam.value : pathParam;
        if (!options.skipUrlEncoding && !allowReserved) {
            value = encodeURIComponent(value);
        }
        routePath = routePath.replace(/\{[\w-]+\}/, String(value));
    }
    return routePath;
}
/**
 * Replace all of the instances of searchValue in value with the provided replaceValue.
 * @param value - The value to search and replace in.
 * @param searchValue - The value to search for in the value argument.
 * @param replaceValue - The value to replace searchValue with in the value argument.
 * @returns The value where each instance of searchValue was replaced with replacedValue.
 */
function replaceAll(value, searchValue, replaceValue) {
    return !value || !searchValue ? value : value.split(searchValue).join(replaceValue || "");
}
//# sourceMappingURL=urlHelpers.js.map

/***/ },

/***/ 2132
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_RETRY_POLICY_COUNT: () => (/* binding */ DEFAULT_RETRY_POLICY_COUNT),
/* harmony export */   SDK_VERSION: () => (/* binding */ SDK_VERSION)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const SDK_VERSION = "0.3.2";
const DEFAULT_RETRY_POLICY_COUNT = 3;
//# sourceMappingURL=constants.js.map

/***/ },

/***/ 2126
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPipelineFromOptions: () => (/* binding */ createPipelineFromOptions)
/* harmony export */ });
/* harmony import */ var _policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2127);
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2114);
/* harmony import */ var _policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2128);
/* harmony import */ var _policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2129);
/* harmony import */ var _policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2133);
/* harmony import */ var _policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2134);
/* harmony import */ var _policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2141);
/* harmony import */ var _util_checkEnvironment_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2142);
/* harmony import */ var _policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2143);
/* harmony import */ var _policies_agentPolicy_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2144);
/* harmony import */ var _policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2145);
/* harmony import */ var _policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2146);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.












/**
 * Create a new pipeline with a default set of customizable policies.
 * @param options - Options to configure a custom pipeline.
 */
function createPipelineFromOptions(options) {
    const pipeline = (0,_pipeline_js__WEBPACK_IMPORTED_MODULE_1__.createEmptyPipeline)();
    if (_util_checkEnvironment_js__WEBPACK_IMPORTED_MODULE_7__.isNodeLike) {
        if (options.agent) {
            pipeline.addPolicy((0,_policies_agentPolicy_js__WEBPACK_IMPORTED_MODULE_9__.agentPolicy)(options.agent));
        }
        if (options.tlsOptions) {
            pipeline.addPolicy((0,_policies_tlsPolicy_js__WEBPACK_IMPORTED_MODULE_10__.tlsPolicy)(options.tlsOptions));
        }
        pipeline.addPolicy((0,_policies_proxyPolicy_js__WEBPACK_IMPORTED_MODULE_8__.proxyPolicy)(options.proxyOptions));
        pipeline.addPolicy((0,_policies_decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_4__.decompressResponsePolicy)());
    }
    pipeline.addPolicy((0,_policies_formDataPolicy_js__WEBPACK_IMPORTED_MODULE_6__.formDataPolicy)(), { beforePolicies: [_policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_11__.multipartPolicyName] });
    pipeline.addPolicy((0,_policies_userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_3__.userAgentPolicy)(options.userAgentOptions));
    // The multipart policy is added after policies with no phase, so that
    // policies can be added between it and formDataPolicy to modify
    // properties (e.g., making the boundary constant in recorded tests).
    pipeline.addPolicy((0,_policies_multipartPolicy_js__WEBPACK_IMPORTED_MODULE_11__.multipartPolicy)(), { afterPhase: "Deserialize" });
    pipeline.addPolicy((0,_policies_defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_5__.defaultRetryPolicy)(options.retryOptions), { phase: "Retry" });
    if (_util_checkEnvironment_js__WEBPACK_IMPORTED_MODULE_7__.isNodeLike) {
        // Both XHR and Fetch expect to handle redirects automatically,
        // so only include this policy when we're in Node.
        pipeline.addPolicy((0,_policies_redirectPolicy_js__WEBPACK_IMPORTED_MODULE_2__.redirectPolicy)(options.redirectOptions), { afterPhase: "Retry" });
    }
    pipeline.addPolicy((0,_policies_logPolicy_js__WEBPACK_IMPORTED_MODULE_0__.logPolicy)(options.loggingOptions), { afterPhase: "Sign" });
    return pipeline;
}
//# sourceMappingURL=createPipelineFromOptions.js.map

/***/ },

/***/ 2121
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDefaultHttpClient: () => (/* binding */ createDefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _nodeHttpClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2122);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Create the correct HttpClient for the current environment.
 */
function createDefaultHttpClient() {
    return (0,_nodeHttpClient_js__WEBPACK_IMPORTED_MODULE_0__.createNodeHttpClient)();
}
//# sourceMappingURL=defaultHttpClient.js.map

/***/ },

/***/ 2109
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHttpHeaders: () => (/* binding */ createHttpHeaders)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
function normalizeName(name) {
    return name.toLowerCase();
}
function* headerIterator(map) {
    for (const entry of map.values()) {
        yield [entry.name, entry.value];
    }
}
class HttpHeadersImpl {
    _headersMap;
    constructor(rawHeaders) {
        this._headersMap = new Map();
        if (rawHeaders) {
            for (const headerName of Object.keys(rawHeaders)) {
                this.set(headerName, rawHeaders[headerName]);
            }
        }
    }
    /**
     * Set a header in this collection with the provided name and value. The name is
     * case-insensitive.
     * @param name - The name of the header to set. This value is case-insensitive.
     * @param value - The value of the header to set.
     */
    set(name, value) {
        this._headersMap.set(normalizeName(name), { name, value: String(value).trim() });
    }
    /**
     * Get the header value for the provided header name, or undefined if no header exists in this
     * collection with the provided name.
     * @param name - The name of the header. This value is case-insensitive.
     */
    get(name) {
        return this._headersMap.get(normalizeName(name))?.value;
    }
    /**
     * Get whether or not this header collection contains a header entry for the provided header name.
     * @param name - The name of the header to set. This value is case-insensitive.
     */
    has(name) {
        return this._headersMap.has(normalizeName(name));
    }
    /**
     * Remove the header with the provided headerName.
     * @param name - The name of the header to remove.
     */
    delete(name) {
        this._headersMap.delete(normalizeName(name));
    }
    /**
     * Get the JSON object representation of this HTTP header collection.
     */
    toJSON(options = {}) {
        const result = {};
        if (options.preserveCase) {
            for (const entry of this._headersMap.values()) {
                result[entry.name] = entry.value;
            }
        }
        else {
            for (const [normalizedName, entry] of this._headersMap) {
                result[normalizedName] = entry.value;
            }
        }
        return result;
    }
    /**
     * Get the string representation of this HTTP header collection.
     */
    toString() {
        return JSON.stringify(this.toJSON({ preserveCase: true }));
    }
    /**
     * Iterate over tuples of header [name, value] pairs.
     */
    [Symbol.iterator]() {
        return headerIterator(this._headersMap);
    }
}
/**
 * Creates an object that satisfies the `HttpHeaders` interface.
 * @param rawHeaders - A simple object representing initial headers
 */
function createHttpHeaders(rawHeaders) {
    return new HttpHeadersImpl(rawHeaders);
}
//# sourceMappingURL=httpHeaders.js.map

/***/ },

/***/ 2104
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* reexport safe */ _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_0__.AbortError),
/* harmony export */   RestError: () => (/* reexport safe */ _restError_js__WEBPACK_IMPORTED_MODULE_7__.RestError),
/* harmony export */   TypeSpecRuntimeLogger: () => (/* reexport safe */ _logger_logger_js__WEBPACK_IMPORTED_MODULE_1__.TypeSpecRuntimeLogger),
/* harmony export */   createClientLogger: () => (/* reexport safe */ _logger_logger_js__WEBPACK_IMPORTED_MODULE_1__.createClientLogger),
/* harmony export */   createDefaultHttpClient: () => (/* reexport safe */ _defaultHttpClient_js__WEBPACK_IMPORTED_MODULE_9__.createDefaultHttpClient),
/* harmony export */   createEmptyPipeline: () => (/* reexport safe */ _pipeline_js__WEBPACK_IMPORTED_MODULE_6__.createEmptyPipeline),
/* harmony export */   createHttpHeaders: () => (/* reexport safe */ _httpHeaders_js__WEBPACK_IMPORTED_MODULE_2__.createHttpHeaders),
/* harmony export */   createPipelineRequest: () => (/* reexport safe */ _pipelineRequest_js__WEBPACK_IMPORTED_MODULE_5__.createPipelineRequest),
/* harmony export */   createRestError: () => (/* reexport safe */ _client_restError_js__WEBPACK_IMPORTED_MODULE_12__.createRestError),
/* harmony export */   getClient: () => (/* reexport safe */ _client_getClient_js__WEBPACK_IMPORTED_MODULE_10__.getClient),
/* harmony export */   getLogLevel: () => (/* reexport safe */ _logger_logger_js__WEBPACK_IMPORTED_MODULE_1__.getLogLevel),
/* harmony export */   isRestError: () => (/* reexport safe */ _restError_js__WEBPACK_IMPORTED_MODULE_7__.isRestError),
/* harmony export */   operationOptionsToRequestParameters: () => (/* reexport safe */ _client_operationOptionHelpers_js__WEBPACK_IMPORTED_MODULE_11__.operationOptionsToRequestParameters),
/* harmony export */   setLogLevel: () => (/* reexport safe */ _logger_logger_js__WEBPACK_IMPORTED_MODULE_1__.setLogLevel),
/* harmony export */   stringToUint8Array: () => (/* reexport safe */ _util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_8__.stringToUint8Array),
/* harmony export */   uint8ArrayToString: () => (/* reexport safe */ _util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_8__.uint8ArrayToString)
/* harmony export */ });
/* harmony import */ var _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2105);
/* harmony import */ var _logger_logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2106);
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2109);
/* harmony import */ var _auth_schemes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2110);
/* harmony import */ var _auth_oauth2Flows_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2111);
/* harmony import */ var _pipelineRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2112);
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2114);
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2115);
/* harmony import */ var _util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2120);
/* harmony import */ var _defaultHttpClient_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2121);
/* harmony import */ var _client_getClient_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2124);
/* harmony import */ var _client_operationOptionHelpers_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2159);
/* harmony import */ var _client_restError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(2160);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.













//# sourceMappingURL=index.js.map

/***/ },

/***/ 2123
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logger: () => (/* binding */ logger)
/* harmony export */ });
/* harmony import */ var _logger_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2106);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const logger = (0,_logger_logger_js__WEBPACK_IMPORTED_MODULE_0__.createClientLogger)("ts-http-runtime");
//# sourceMappingURL=log.js.map

/***/ },

/***/ 2107
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2108);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const debugEnvVariable = (typeof process !== "undefined" && process.env && process.env.DEBUG) || undefined;
let enabledString;
let enabledNamespaces = [];
let skippedNamespaces = [];
const debuggers = [];
if (debugEnvVariable) {
    enable(debugEnvVariable);
}
const debugObj = Object.assign((namespace) => {
    return createDebugger(namespace);
}, {
    enable,
    enabled,
    disable,
    log: _log_js__WEBPACK_IMPORTED_MODULE_0__.log,
});
function enable(namespaces) {
    enabledString = namespaces;
    enabledNamespaces = [];
    skippedNamespaces = [];
    const namespaceList = namespaces.split(",").map((ns) => ns.trim());
    for (const ns of namespaceList) {
        if (ns.startsWith("-")) {
            skippedNamespaces.push(ns.substring(1));
        }
        else {
            enabledNamespaces.push(ns);
        }
    }
    for (const instance of debuggers) {
        instance.enabled = enabled(instance.namespace);
    }
}
function enabled(namespace) {
    if (namespace.endsWith("*")) {
        return true;
    }
    for (const skipped of skippedNamespaces) {
        if (namespaceMatches(namespace, skipped)) {
            return false;
        }
    }
    for (const enabledNamespace of enabledNamespaces) {
        if (namespaceMatches(namespace, enabledNamespace)) {
            return true;
        }
    }
    return false;
}
/**
 * Given a namespace, check if it matches a pattern.
 * Patterns only have a single wildcard character which is *.
 * The behavior of * is that it matches zero or more other characters.
 */
function namespaceMatches(namespace, patternToMatch) {
    // simple case, no pattern matching required
    if (patternToMatch.indexOf("*") === -1) {
        return namespace === patternToMatch;
    }
    let pattern = patternToMatch;
    // normalize successive * if needed
    if (patternToMatch.indexOf("**") !== -1) {
        const patternParts = [];
        let lastCharacter = "";
        for (const character of patternToMatch) {
            if (character === "*" && lastCharacter === "*") {
                continue;
            }
            else {
                lastCharacter = character;
                patternParts.push(character);
            }
        }
        pattern = patternParts.join("");
    }
    let namespaceIndex = 0;
    let patternIndex = 0;
    const patternLength = pattern.length;
    const namespaceLength = namespace.length;
    let lastWildcard = -1;
    let lastWildcardNamespace = -1;
    while (namespaceIndex < namespaceLength && patternIndex < patternLength) {
        if (pattern[patternIndex] === "*") {
            lastWildcard = patternIndex;
            patternIndex++;
            if (patternIndex === patternLength) {
                // if wildcard is the last character, it will match the remaining namespace string
                return true;
            }
            // now we let the wildcard eat characters until we match the next literal in the pattern
            while (namespace[namespaceIndex] !== pattern[patternIndex]) {
                namespaceIndex++;
                // reached the end of the namespace without a match
                if (namespaceIndex === namespaceLength) {
                    return false;
                }
            }
            // now that we have a match, let's try to continue on
            // however, it's possible we could find a later match
            // so keep a reference in case we have to backtrack
            lastWildcardNamespace = namespaceIndex;
            namespaceIndex++;
            patternIndex++;
            continue;
        }
        else if (pattern[patternIndex] === namespace[namespaceIndex]) {
            // simple case: literal pattern matches so keep going
            patternIndex++;
            namespaceIndex++;
        }
        else if (lastWildcard >= 0) {
            // special case: we don't have a literal match, but there is a previous wildcard
            // which we can backtrack to and try having the wildcard eat the match instead
            patternIndex = lastWildcard + 1;
            namespaceIndex = lastWildcardNamespace + 1;
            // we've reached the end of the namespace without a match
            if (namespaceIndex === namespaceLength) {
                return false;
            }
            // similar to the previous logic, let's keep going until we find the next literal match
            while (namespace[namespaceIndex] !== pattern[patternIndex]) {
                namespaceIndex++;
                if (namespaceIndex === namespaceLength) {
                    return false;
                }
            }
            lastWildcardNamespace = namespaceIndex;
            namespaceIndex++;
            patternIndex++;
            continue;
        }
        else {
            return false;
        }
    }
    const namespaceDone = namespaceIndex === namespace.length;
    const patternDone = patternIndex === pattern.length;
    // this is to detect the case of an unneeded final wildcard
    // e.g. the pattern `ab*` should match the string `ab`
    const trailingWildCard = patternIndex === pattern.length - 1 && pattern[patternIndex] === "*";
    return namespaceDone && (patternDone || trailingWildCard);
}
function disable() {
    const result = enabledString || "";
    enable("");
    return result;
}
function createDebugger(namespace) {
    const newDebugger = Object.assign(debug, {
        enabled: enabled(namespace),
        destroy,
        log: debugObj.log,
        namespace,
        extend,
    });
    function debug(...args) {
        if (!newDebugger.enabled) {
            return;
        }
        if (args.length > 0) {
            args[0] = `${namespace} ${args[0]}`;
        }
        newDebugger.log(...args);
    }
    debuggers.push(newDebugger);
    return newDebugger;
}
function destroy() {
    const index = debuggers.indexOf(this);
    if (index >= 0) {
        debuggers.splice(index, 1);
        return true;
    }
    return false;
}
function extend(namespace) {
    const newDebugger = createDebugger(`${this.namespace}:${namespace}`);
    newDebugger.log = this.log;
    return newDebugger;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (debugObj);
//# sourceMappingURL=debug.js.map

/***/ },

/***/ 2165
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createLoggerContext: () => (/* reexport safe */ _logger_js__WEBPACK_IMPORTED_MODULE_0__.createLoggerContext)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2106);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

//# sourceMappingURL=internal.js.map

/***/ },

/***/ 2108
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log)
/* harmony export */ });
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1925);
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1447);
/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1450);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



function log(message, ...args) {
    node_process__WEBPACK_IMPORTED_MODULE_2__.stderr.write(`${node_util__WEBPACK_IMPORTED_MODULE_1__.format(message, ...args)}${node_os__WEBPACK_IMPORTED_MODULE_0__.EOL}`);
}
//# sourceMappingURL=log.js.map

/***/ },

/***/ 2106
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TypeSpecRuntimeLogger: () => (/* binding */ TypeSpecRuntimeLogger),
/* harmony export */   createClientLogger: () => (/* binding */ createClientLogger),
/* harmony export */   createLoggerContext: () => (/* binding */ createLoggerContext),
/* harmony export */   getLogLevel: () => (/* binding */ getLogLevel),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2107);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const TYPESPEC_RUNTIME_LOG_LEVELS = ["verbose", "info", "warning", "error"];
const levelMap = {
    verbose: 400,
    info: 300,
    warning: 200,
    error: 100,
};
function patchLogMethod(parent, child) {
    child.log = (...args) => {
        parent.log(...args);
    };
}
function isTypeSpecRuntimeLogLevel(level) {
    return TYPESPEC_RUNTIME_LOG_LEVELS.includes(level);
}
/**
 * Creates a logger context base on the provided options.
 * @param options - The options for creating a logger context.
 * @returns The logger context.
 */
function createLoggerContext(options) {
    const registeredLoggers = new Set();
    const logLevelFromEnv = (typeof process !== "undefined" && process.env && process.env[options.logLevelEnvVarName]) ||
        undefined;
    let logLevel;
    const clientLogger = (0,_debug_js__WEBPACK_IMPORTED_MODULE_0__["default"])(options.namespace);
    clientLogger.log = (...args) => {
        _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].log(...args);
    };
    function contextSetLogLevel(level) {
        if (level && !isTypeSpecRuntimeLogLevel(level)) {
            throw new Error(`Unknown log level '${level}'. Acceptable values: ${TYPESPEC_RUNTIME_LOG_LEVELS.join(",")}`);
        }
        logLevel = level;
        const enabledNamespaces = [];
        for (const logger of registeredLoggers) {
            if (shouldEnable(logger)) {
                enabledNamespaces.push(logger.namespace);
            }
        }
        _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].enable(enabledNamespaces.join(","));
    }
    if (logLevelFromEnv) {
        // avoid calling setLogLevel because we don't want a mis-set environment variable to crash
        if (isTypeSpecRuntimeLogLevel(logLevelFromEnv)) {
            contextSetLogLevel(logLevelFromEnv);
        }
        else {
            console.error(`${options.logLevelEnvVarName} set to unknown log level '${logLevelFromEnv}'; logging is not enabled. Acceptable values: ${TYPESPEC_RUNTIME_LOG_LEVELS.join(", ")}.`);
        }
    }
    function shouldEnable(logger) {
        return Boolean(logLevel && levelMap[logger.level] <= levelMap[logLevel]);
    }
    function createLogger(parent, level) {
        const logger = Object.assign(parent.extend(level), {
            level,
        });
        patchLogMethod(parent, logger);
        if (shouldEnable(logger)) {
            const enabledNamespaces = _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].disable();
            _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].enable(enabledNamespaces + "," + logger.namespace);
        }
        registeredLoggers.add(logger);
        return logger;
    }
    function contextGetLogLevel() {
        return logLevel;
    }
    function contextCreateClientLogger(namespace) {
        const clientRootLogger = clientLogger.extend(namespace);
        patchLogMethod(clientLogger, clientRootLogger);
        return {
            error: createLogger(clientRootLogger, "error"),
            warning: createLogger(clientRootLogger, "warning"),
            info: createLogger(clientRootLogger, "info"),
            verbose: createLogger(clientRootLogger, "verbose"),
        };
    }
    return {
        setLogLevel: contextSetLogLevel,
        getLogLevel: contextGetLogLevel,
        createClientLogger: contextCreateClientLogger,
        logger: clientLogger,
    };
}
const context = createLoggerContext({
    logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
    namespace: "typeSpecRuntime",
});
/**
 * Immediately enables logging at the specified log level. If no level is specified, logging is disabled.
 * @param level - The log level to enable for logging.
 * Options from most verbose to least verbose are:
 * - verbose
 * - info
 * - warning
 * - error
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
const TypeSpecRuntimeLogger = context.logger;
/**
 * Retrieves the currently specified log level.
 */
function setLogLevel(logLevel) {
    context.setLogLevel(logLevel);
}
/**
 * Retrieves the currently specified log level.
 */
function getLogLevel() {
    return context.getLogLevel();
}
/**
 * Creates a logger for use by the SDKs that inherits from `TypeSpecRuntimeLogger`.
 * @param namespace - The name of the SDK package.
 * @hidden
 */
function createClientLogger(namespace) {
    return context.createClientLogger(namespace);
}
//# sourceMappingURL=logger.js.map

/***/ },

/***/ 2122
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNodeHttpClient: () => (/* binding */ createNodeHttpClient),
/* harmony export */   getBodyLength: () => (/* binding */ getBodyLength)
/* harmony export */ });
/* harmony import */ var node_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(206);
/* harmony import */ var node_https__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(205);
/* harmony import */ var node_zlib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1443);
/* harmony import */ var node_stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1108);
/* harmony import */ var _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2105);
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2109);
/* harmony import */ var _restError_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2115);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2123);
/* harmony import */ var _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2119);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.









const DEFAULT_TLS_SETTINGS = {};
function isReadableStream(body) {
    return body && typeof body.pipe === "function";
}
function isStreamComplete(stream) {
    if (stream.readable === false) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const handler = () => {
            resolve();
            stream.removeListener("close", handler);
            stream.removeListener("end", handler);
            stream.removeListener("error", handler);
        };
        stream.on("close", handler);
        stream.on("end", handler);
        stream.on("error", handler);
    });
}
function isArrayBuffer(body) {
    return body && typeof body.byteLength === "number";
}
class ReportTransform extends node_stream__WEBPACK_IMPORTED_MODULE_3__.Transform {
    loadedBytes = 0;
    progressCallback;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    _transform(chunk, _encoding, callback) {
        this.push(chunk);
        this.loadedBytes += chunk.length;
        try {
            this.progressCallback({ loadedBytes: this.loadedBytes });
            callback();
        }
        catch (e) {
            callback(e);
        }
    }
    constructor(progressCallback) {
        super();
        this.progressCallback = progressCallback;
    }
}
/**
 * A HttpClient implementation that uses Node's "https" module to send HTTPS requests.
 * @internal
 */
class NodeHttpClient {
    cachedHttpAgent;
    cachedHttpsAgents = new WeakMap();
    /**
     * Makes a request over an underlying transport layer and returns the response.
     * @param request - The request to be made.
     */
    async sendRequest(request) {
        const abortController = new AbortController();
        let abortListener;
        if (request.abortSignal) {
            if (request.abortSignal.aborted) {
                throw new _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_4__.AbortError("The operation was aborted. Request has already been canceled.");
            }
            abortListener = (event) => {
                if (event.type === "abort") {
                    abortController.abort();
                }
            };
            request.abortSignal.addEventListener("abort", abortListener);
        }
        let timeoutId;
        if (request.timeout > 0) {
            timeoutId = setTimeout(() => {
                const sanitizer = new _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_8__.Sanitizer();
                _log_js__WEBPACK_IMPORTED_MODULE_7__.logger.info(`request to '${sanitizer.sanitizeUrl(request.url)}' timed out. canceling...`);
                abortController.abort();
            }, request.timeout);
        }
        const acceptEncoding = request.headers.get("Accept-Encoding");
        const shouldDecompress = acceptEncoding?.includes("gzip") || acceptEncoding?.includes("deflate");
        let body = typeof request.body === "function" ? request.body() : request.body;
        if (body && !request.headers.has("Content-Length")) {
            const bodyLength = getBodyLength(body);
            if (bodyLength !== null) {
                request.headers.set("Content-Length", bodyLength);
            }
        }
        let responseStream;
        try {
            if (body && request.onUploadProgress) {
                const onUploadProgress = request.onUploadProgress;
                const uploadReportStream = new ReportTransform(onUploadProgress);
                uploadReportStream.on("error", (e) => {
                    _log_js__WEBPACK_IMPORTED_MODULE_7__.logger.error("Error in upload progress", e);
                });
                if (isReadableStream(body)) {
                    body.pipe(uploadReportStream);
                }
                else {
                    uploadReportStream.end(body);
                }
                body = uploadReportStream;
            }
            const res = await this.makeRequest(request, abortController, body);
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            const headers = getResponseHeaders(res);
            const status = res.statusCode ?? 0;
            const response = {
                status,
                headers,
                request,
            };
            // Responses to HEAD must not have a body.
            // If they do return a body, that body must be ignored.
            if (request.method === "HEAD") {
                // call resume() and not destroy() to avoid closing the socket
                // and losing keep alive
                res.resume();
                return response;
            }
            responseStream = shouldDecompress ? getDecodedResponseStream(res, headers) : res;
            const onDownloadProgress = request.onDownloadProgress;
            if (onDownloadProgress) {
                const downloadReportStream = new ReportTransform(onDownloadProgress);
                downloadReportStream.on("error", (e) => {
                    _log_js__WEBPACK_IMPORTED_MODULE_7__.logger.error("Error in download progress", e);
                });
                responseStream.pipe(downloadReportStream);
                responseStream = downloadReportStream;
            }
            if (
            // Value of POSITIVE_INFINITY in streamResponseStatusCodes is considered as any status code
            request.streamResponseStatusCodes?.has(Number.POSITIVE_INFINITY) ||
                request.streamResponseStatusCodes?.has(response.status)) {
                response.readableStreamBody = responseStream;
            }
            else {
                response.bodyAsText = await streamToText(responseStream);
            }
            return response;
        }
        finally {
            // clean up event listener
            if (request.abortSignal && abortListener) {
                let uploadStreamDone = Promise.resolve();
                if (isReadableStream(body)) {
                    uploadStreamDone = isStreamComplete(body);
                }
                let downloadStreamDone = Promise.resolve();
                if (isReadableStream(responseStream)) {
                    downloadStreamDone = isStreamComplete(responseStream);
                }
                Promise.all([uploadStreamDone, downloadStreamDone])
                    .then(() => {
                    // eslint-disable-next-line promise/always-return
                    if (abortListener) {
                        request.abortSignal?.removeEventListener("abort", abortListener);
                    }
                })
                    .catch((e) => {
                    _log_js__WEBPACK_IMPORTED_MODULE_7__.logger.warning("Error when cleaning up abortListener on httpRequest", e);
                });
            }
        }
    }
    makeRequest(request, abortController, body) {
        const url = new URL(request.url);
        const isInsecure = url.protocol !== "https:";
        if (isInsecure && !request.allowInsecureConnection) {
            throw new Error(`Cannot connect to ${request.url} while allowInsecureConnection is false.`);
        }
        const agent = request.agent ?? this.getOrCreateAgent(request, isInsecure);
        const options = {
            agent,
            hostname: url.hostname,
            path: `${url.pathname}${url.search}`,
            port: url.port,
            method: request.method,
            headers: request.headers.toJSON({ preserveCase: true }),
            ...request.requestOverrides,
        };
        return new Promise((resolve, reject) => {
            const req = isInsecure ? node_http__WEBPACK_IMPORTED_MODULE_0__.request(options, resolve) : node_https__WEBPACK_IMPORTED_MODULE_1__.request(options, resolve);
            req.once("error", (err) => {
                reject(new _restError_js__WEBPACK_IMPORTED_MODULE_6__.RestError(err.message, { code: err.code ?? _restError_js__WEBPACK_IMPORTED_MODULE_6__.RestError.REQUEST_SEND_ERROR, request }));
            });
            abortController.signal.addEventListener("abort", () => {
                const abortError = new _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_4__.AbortError("The operation was aborted. Rejecting from abort signal callback while making request.");
                req.destroy(abortError);
                reject(abortError);
            });
            if (body && isReadableStream(body)) {
                body.pipe(req);
            }
            else if (body) {
                if (typeof body === "string" || Buffer.isBuffer(body)) {
                    req.end(body);
                }
                else if (isArrayBuffer(body)) {
                    req.end(ArrayBuffer.isView(body) ? Buffer.from(body.buffer) : Buffer.from(body));
                }
                else {
                    _log_js__WEBPACK_IMPORTED_MODULE_7__.logger.error("Unrecognized body type", body);
                    reject(new _restError_js__WEBPACK_IMPORTED_MODULE_6__.RestError("Unrecognized body type"));
                }
            }
            else {
                // streams don't like "undefined" being passed as data
                req.end();
            }
        });
    }
    getOrCreateAgent(request, isInsecure) {
        const disableKeepAlive = request.disableKeepAlive;
        // Handle Insecure requests first
        if (isInsecure) {
            if (disableKeepAlive) {
                // keepAlive:false is the default so we don't need a custom Agent
                return node_http__WEBPACK_IMPORTED_MODULE_0__.globalAgent;
            }
            if (!this.cachedHttpAgent) {
                // If there is no cached agent create a new one and cache it.
                this.cachedHttpAgent = new node_http__WEBPACK_IMPORTED_MODULE_0__.Agent({ keepAlive: true });
            }
            return this.cachedHttpAgent;
        }
        else {
            if (disableKeepAlive && !request.tlsSettings) {
                // When there are no tlsSettings and keepAlive is false
                // we don't need a custom agent
                return node_https__WEBPACK_IMPORTED_MODULE_1__.globalAgent;
            }
            // We use the tlsSettings to index cached clients
            const tlsSettings = request.tlsSettings ?? DEFAULT_TLS_SETTINGS;
            // Get the cached agent or create a new one with the
            // provided values for keepAlive and tlsSettings
            let agent = this.cachedHttpsAgents.get(tlsSettings);
            if (agent && agent.options.keepAlive === !disableKeepAlive) {
                return agent;
            }
            _log_js__WEBPACK_IMPORTED_MODULE_7__.logger.info("No cached TLS Agent exist, creating a new Agent");
            agent = new node_https__WEBPACK_IMPORTED_MODULE_1__.Agent({
                // keepAlive is true if disableKeepAlive is false.
                keepAlive: !disableKeepAlive,
                // Since we are spreading, if no tslSettings were provided, nothing is added to the agent options.
                ...tlsSettings,
            });
            this.cachedHttpsAgents.set(tlsSettings, agent);
            return agent;
        }
    }
}
function getResponseHeaders(res) {
    const headers = (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_5__.createHttpHeaders)();
    for (const header of Object.keys(res.headers)) {
        const value = res.headers[header];
        if (Array.isArray(value)) {
            if (value.length > 0) {
                headers.set(header, value[0]);
            }
        }
        else if (value) {
            headers.set(header, value);
        }
    }
    return headers;
}
function getDecodedResponseStream(stream, headers) {
    const contentEncoding = headers.get("Content-Encoding");
    if (contentEncoding === "gzip") {
        const unzip = node_zlib__WEBPACK_IMPORTED_MODULE_2__.createGunzip();
        stream.pipe(unzip);
        return unzip;
    }
    else if (contentEncoding === "deflate") {
        const inflate = node_zlib__WEBPACK_IMPORTED_MODULE_2__.createInflate();
        stream.pipe(inflate);
        return inflate;
    }
    return stream;
}
function streamToText(stream) {
    return new Promise((resolve, reject) => {
        const buffer = [];
        stream.on("data", (chunk) => {
            if (Buffer.isBuffer(chunk)) {
                buffer.push(chunk);
            }
            else {
                buffer.push(Buffer.from(chunk));
            }
        });
        stream.on("end", () => {
            resolve(Buffer.concat(buffer).toString("utf8"));
        });
        stream.on("error", (e) => {
            if (e && e?.name === "AbortError") {
                reject(e);
            }
            else {
                reject(new _restError_js__WEBPACK_IMPORTED_MODULE_6__.RestError(`Error reading response as text: ${e.message}`, {
                    code: _restError_js__WEBPACK_IMPORTED_MODULE_6__.RestError.PARSE_ERROR,
                }));
            }
        });
    });
}
/** @internal */
function getBodyLength(body) {
    if (!body) {
        return 0;
    }
    else if (Buffer.isBuffer(body)) {
        return body.length;
    }
    else if (isReadableStream(body)) {
        return null;
    }
    else if (isArrayBuffer(body)) {
        return body.byteLength;
    }
    else if (typeof body === "string") {
        return Buffer.from(body).length;
    }
    else {
        return null;
    }
}
/**
 * Create a new HttpClient instance for the NodeJS environment.
 * @internal
 */
function createNodeHttpClient() {
    return new NodeHttpClient();
}
//# sourceMappingURL=nodeHttpClient.js.map

/***/ },

/***/ 2114
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createEmptyPipeline: () => (/* binding */ createEmptyPipeline)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const ValidPhaseNames = new Set(["Deserialize", "Serialize", "Retry", "Sign"]);
/**
 * A private implementation of Pipeline.
 * Do not export this class from the package.
 * @internal
 */
class HttpPipeline {
    _policies = [];
    _orderedPolicies;
    constructor(policies) {
        this._policies = policies?.slice(0) ?? [];
        this._orderedPolicies = undefined;
    }
    addPolicy(policy, options = {}) {
        if (options.phase && options.afterPhase) {
            throw new Error("Policies inside a phase cannot specify afterPhase.");
        }
        if (options.phase && !ValidPhaseNames.has(options.phase)) {
            throw new Error(`Invalid phase name: ${options.phase}`);
        }
        if (options.afterPhase && !ValidPhaseNames.has(options.afterPhase)) {
            throw new Error(`Invalid afterPhase name: ${options.afterPhase}`);
        }
        this._policies.push({
            policy,
            options,
        });
        this._orderedPolicies = undefined;
    }
    removePolicy(options) {
        const removedPolicies = [];
        this._policies = this._policies.filter((policyDescriptor) => {
            if ((options.name && policyDescriptor.policy.name === options.name) ||
                (options.phase && policyDescriptor.options.phase === options.phase)) {
                removedPolicies.push(policyDescriptor.policy);
                return false;
            }
            else {
                return true;
            }
        });
        this._orderedPolicies = undefined;
        return removedPolicies;
    }
    sendRequest(httpClient, request) {
        const policies = this.getOrderedPolicies();
        const pipeline = policies.reduceRight((next, policy) => {
            return (req) => {
                return policy.sendRequest(req, next);
            };
        }, (req) => httpClient.sendRequest(req));
        return pipeline(request);
    }
    getOrderedPolicies() {
        if (!this._orderedPolicies) {
            this._orderedPolicies = this.orderPolicies();
        }
        return this._orderedPolicies;
    }
    clone() {
        return new HttpPipeline(this._policies);
    }
    static create() {
        return new HttpPipeline();
    }
    orderPolicies() {
        /**
         * The goal of this method is to reliably order pipeline policies
         * based on their declared requirements when they were added.
         *
         * Order is first determined by phase:
         *
         * 1. Serialize Phase
         * 2. Policies not in a phase
         * 3. Deserialize Phase
         * 4. Retry Phase
         * 5. Sign Phase
         *
         * Within each phase, policies are executed in the order
         * they were added unless they were specified to execute
         * before/after other policies or after a particular phase.
         *
         * To determine the final order, we will walk the policy list
         * in phase order multiple times until all dependencies are
         * satisfied.
         *
         * `afterPolicies` are the set of policies that must be
         * executed before a given policy. This requirement is
         * considered satisfied when each of the listed policies
         * have been scheduled.
         *
         * `beforePolicies` are the set of policies that must be
         * executed after a given policy. Since this dependency
         * can be expressed by converting it into a equivalent
         * `afterPolicies` declarations, they are normalized
         * into that form for simplicity.
         *
         * An `afterPhase` dependency is considered satisfied when all
         * policies in that phase have scheduled.
         *
         */
        const result = [];
        // Track all policies we know about.
        const policyMap = new Map();
        function createPhase(name) {
            return {
                name,
                policies: new Set(),
                hasRun: false,
                hasAfterPolicies: false,
            };
        }
        // Track policies for each phase.
        const serializePhase = createPhase("Serialize");
        const noPhase = createPhase("None");
        const deserializePhase = createPhase("Deserialize");
        const retryPhase = createPhase("Retry");
        const signPhase = createPhase("Sign");
        // a list of phases in order
        const orderedPhases = [serializePhase, noPhase, deserializePhase, retryPhase, signPhase];
        // Small helper function to map phase name to each Phase
        function getPhase(phase) {
            if (phase === "Retry") {
                return retryPhase;
            }
            else if (phase === "Serialize") {
                return serializePhase;
            }
            else if (phase === "Deserialize") {
                return deserializePhase;
            }
            else if (phase === "Sign") {
                return signPhase;
            }
            else {
                return noPhase;
            }
        }
        // First walk each policy and create a node to track metadata.
        for (const descriptor of this._policies) {
            const policy = descriptor.policy;
            const options = descriptor.options;
            const policyName = policy.name;
            if (policyMap.has(policyName)) {
                throw new Error("Duplicate policy names not allowed in pipeline");
            }
            const node = {
                policy,
                dependsOn: new Set(),
                dependants: new Set(),
            };
            if (options.afterPhase) {
                node.afterPhase = getPhase(options.afterPhase);
                node.afterPhase.hasAfterPolicies = true;
            }
            policyMap.set(policyName, node);
            const phase = getPhase(options.phase);
            phase.policies.add(node);
        }
        // Now that each policy has a node, connect dependency references.
        for (const descriptor of this._policies) {
            const { policy, options } = descriptor;
            const policyName = policy.name;
            const node = policyMap.get(policyName);
            if (!node) {
                throw new Error(`Missing node for policy ${policyName}`);
            }
            if (options.afterPolicies) {
                for (const afterPolicyName of options.afterPolicies) {
                    const afterNode = policyMap.get(afterPolicyName);
                    if (afterNode) {
                        // Linking in both directions helps later
                        // when we want to notify dependants.
                        node.dependsOn.add(afterNode);
                        afterNode.dependants.add(node);
                    }
                }
            }
            if (options.beforePolicies) {
                for (const beforePolicyName of options.beforePolicies) {
                    const beforeNode = policyMap.get(beforePolicyName);
                    if (beforeNode) {
                        // To execute before another node, make it
                        // depend on the current node.
                        beforeNode.dependsOn.add(node);
                        node.dependants.add(beforeNode);
                    }
                }
            }
        }
        function walkPhase(phase) {
            phase.hasRun = true;
            // Sets iterate in insertion order
            for (const node of phase.policies) {
                if (node.afterPhase && (!node.afterPhase.hasRun || node.afterPhase.policies.size)) {
                    // If this node is waiting on a phase to complete,
                    // we need to skip it for now.
                    // Even if the phase is empty, we should wait for it
                    // to be walked to avoid re-ordering policies.
                    continue;
                }
                if (node.dependsOn.size === 0) {
                    // If there's nothing else we're waiting for, we can
                    // add this policy to the result list.
                    result.push(node.policy);
                    // Notify anything that depends on this policy that
                    // the policy has been scheduled.
                    for (const dependant of node.dependants) {
                        dependant.dependsOn.delete(node);
                    }
                    policyMap.delete(node.policy.name);
                    phase.policies.delete(node);
                }
            }
        }
        function walkPhases() {
            for (const phase of orderedPhases) {
                walkPhase(phase);
                // if the phase isn't complete
                if (phase.policies.size > 0 && phase !== noPhase) {
                    if (!noPhase.hasRun) {
                        // Try running noPhase to see if that unblocks this phase next tick.
                        // This can happen if a phase that happens before noPhase
                        // is waiting on a noPhase policy to complete.
                        walkPhase(noPhase);
                    }
                    // Don't proceed to the next phase until this phase finishes.
                    return;
                }
                if (phase.hasAfterPolicies) {
                    // Run any policies unblocked by this phase
                    walkPhase(noPhase);
                }
            }
        }
        // Iterate until we've put every node in the result list.
        let iteration = 0;
        while (policyMap.size > 0) {
            iteration++;
            const initialResultLength = result.length;
            // Keep walking each phase in order until we can order every node.
            walkPhases();
            // The result list *should* get at least one larger each time
            // after the first full pass.
            // Otherwise, we're going to loop forever.
            if (result.length <= initialResultLength && iteration > 1) {
                throw new Error("Cannot satisfy policy dependencies due to requirements cycle.");
            }
        }
        return result;
    }
}
/**
 * Creates a totally empty pipeline.
 * Useful for testing or creating a custom one.
 */
function createEmptyPipeline() {
    return HttpPipeline.create();
}
//# sourceMappingURL=pipeline.js.map

/***/ },

/***/ 2112
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPipelineRequest: () => (/* binding */ createPipelineRequest)
/* harmony export */ });
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2109);
/* harmony import */ var _util_uuidUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2113);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


class PipelineRequestImpl {
    url;
    method;
    headers;
    timeout;
    withCredentials;
    body;
    multipartBody;
    formData;
    streamResponseStatusCodes;
    enableBrowserStreams;
    proxySettings;
    disableKeepAlive;
    abortSignal;
    requestId;
    allowInsecureConnection;
    onUploadProgress;
    onDownloadProgress;
    requestOverrides;
    authSchemes;
    constructor(options) {
        this.url = options.url;
        this.body = options.body;
        this.headers = options.headers ?? (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_0__.createHttpHeaders)();
        this.method = options.method ?? "GET";
        this.timeout = options.timeout ?? 0;
        this.multipartBody = options.multipartBody;
        this.formData = options.formData;
        this.disableKeepAlive = options.disableKeepAlive ?? false;
        this.proxySettings = options.proxySettings;
        this.streamResponseStatusCodes = options.streamResponseStatusCodes;
        this.withCredentials = options.withCredentials ?? false;
        this.abortSignal = options.abortSignal;
        this.onUploadProgress = options.onUploadProgress;
        this.onDownloadProgress = options.onDownloadProgress;
        this.requestId = options.requestId || (0,_util_uuidUtils_js__WEBPACK_IMPORTED_MODULE_1__.randomUUID)();
        this.allowInsecureConnection = options.allowInsecureConnection ?? false;
        this.enableBrowserStreams = options.enableBrowserStreams ?? false;
        this.requestOverrides = options.requestOverrides;
        this.authSchemes = options.authSchemes;
    }
}
/**
 * Creates a new pipeline request with the given options.
 * This method is to allow for the easy setting of default values and not required.
 * @param options - The options to create the request with.
 */
function createPipelineRequest(options) {
    return new PipelineRequestImpl(options);
}
//# sourceMappingURL=pipelineRequest.js.map

/***/ },

/***/ 2144
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   agentPolicy: () => (/* binding */ agentPolicy),
/* harmony export */   agentPolicyName: () => (/* binding */ agentPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Name of the Agent Policy
 */
const agentPolicyName = "agentPolicy";
/**
 * Gets a pipeline policy that sets http.agent
 */
function agentPolicy(agent) {
    return {
        name: agentPolicyName,
        sendRequest: async (req, next) => {
            // Users may define an agent on the request, honor it over the client level one
            if (!req.agent) {
                req.agent = agent;
            }
            return next(req);
        },
    };
}
//# sourceMappingURL=agentPolicy.js.map

/***/ },

/***/ 2151
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiKeyAuthenticationPolicy: () => (/* binding */ apiKeyAuthenticationPolicy),
/* harmony export */   apiKeyAuthenticationPolicyName: () => (/* binding */ apiKeyAuthenticationPolicyName)
/* harmony export */ });
/* harmony import */ var _checkInsecureConnection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2152);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Name of the API Key Authentication Policy
 */
const apiKeyAuthenticationPolicyName = "apiKeyAuthenticationPolicy";
/**
 * Gets a pipeline policy that adds API key authentication to requests
 */
function apiKeyAuthenticationPolicy(options) {
    return {
        name: apiKeyAuthenticationPolicyName,
        async sendRequest(request, next) {
            // Ensure allowInsecureConnection is explicitly set when sending request to non-https URLs
            (0,_checkInsecureConnection_js__WEBPACK_IMPORTED_MODULE_0__.ensureSecureConnection)(request, options);
            const scheme = (request.authSchemes ?? options.authSchemes)?.find((x) => x.kind === "apiKey");
            // Skip adding authentication header if no API key authentication scheme is found
            if (!scheme) {
                return next(request);
            }
            if (scheme.apiKeyLocation !== "header") {
                throw new Error(`Unsupported API key location: ${scheme.apiKeyLocation}`);
            }
            request.headers.set(scheme.name, options.credential.key);
            return next(request);
        },
    };
}
//# sourceMappingURL=apiKeyAuthenticationPolicy.js.map

/***/ },

/***/ 2153
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   basicAuthenticationPolicy: () => (/* binding */ basicAuthenticationPolicy),
/* harmony export */   basicAuthenticationPolicyName: () => (/* binding */ basicAuthenticationPolicyName)
/* harmony export */ });
/* harmony import */ var _util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2120);
/* harmony import */ var _checkInsecureConnection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2152);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * Name of the Basic Authentication Policy
 */
const basicAuthenticationPolicyName = "bearerAuthenticationPolicy";
/**
 * Gets a pipeline policy that adds basic authentication to requests
 */
function basicAuthenticationPolicy(options) {
    return {
        name: basicAuthenticationPolicyName,
        async sendRequest(request, next) {
            // Ensure allowInsecureConnection is explicitly set when sending request to non-https URLs
            (0,_checkInsecureConnection_js__WEBPACK_IMPORTED_MODULE_1__.ensureSecureConnection)(request, options);
            const scheme = (request.authSchemes ?? options.authSchemes)?.find((x) => x.kind === "http" && x.scheme === "basic");
            // Skip adding authentication header if no basic authentication scheme is found
            if (!scheme) {
                return next(request);
            }
            const { username, password } = options.credential;
            const headerValue = (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.uint8ArrayToString)((0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(`${username}:${password}`, "utf-8"), "base64");
            request.headers.set("Authorization", `Basic ${headerValue}`);
            return next(request);
        },
    };
}
//# sourceMappingURL=basicAuthenticationPolicy.js.map

/***/ },

/***/ 2154
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bearerAuthenticationPolicy: () => (/* binding */ bearerAuthenticationPolicy),
/* harmony export */   bearerAuthenticationPolicyName: () => (/* binding */ bearerAuthenticationPolicyName)
/* harmony export */ });
/* harmony import */ var _checkInsecureConnection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2152);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Name of the Bearer Authentication Policy
 */
const bearerAuthenticationPolicyName = "bearerAuthenticationPolicy";
/**
 * Gets a pipeline policy that adds bearer token authentication to requests
 */
function bearerAuthenticationPolicy(options) {
    return {
        name: bearerAuthenticationPolicyName,
        async sendRequest(request, next) {
            // Ensure allowInsecureConnection is explicitly set when sending request to non-https URLs
            (0,_checkInsecureConnection_js__WEBPACK_IMPORTED_MODULE_0__.ensureSecureConnection)(request, options);
            const scheme = (request.authSchemes ?? options.authSchemes)?.find((x) => x.kind === "http" && x.scheme === "bearer");
            // Skip adding authentication header if no bearer authentication scheme is found
            if (!scheme) {
                return next(request);
            }
            const token = await options.credential.getBearerToken({
                abortSignal: request.abortSignal,
            });
            request.headers.set("Authorization", `Bearer ${token}`);
            return next(request);
        },
    };
}
//# sourceMappingURL=bearerAuthenticationPolicy.js.map

/***/ },

/***/ 2152
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ensureSecureConnection: () => (/* binding */ ensureSecureConnection)
/* harmony export */ });
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2123);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Ensure the warining is only emitted once
let insecureConnectionWarningEmmitted = false;
/**
 * Checks if the request is allowed to be sent over an insecure connection.
 *
 * A request is allowed to be sent over an insecure connection when:
 * - The `allowInsecureConnection` option is set to `true`.
 * - The request has the `allowInsecureConnection` property set to `true`.
 * - The request is being sent to `localhost` or `127.0.0.1`
 */
function allowInsecureConnection(request, options) {
    if (options.allowInsecureConnection && request.allowInsecureConnection) {
        const url = new URL(request.url);
        if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
            return true;
        }
    }
    return false;
}
/**
 * Logs a warning about sending a token over an insecure connection.
 *
 * This function will emit a node warning once, but log the warning every time.
 */
function emitInsecureConnectionWarning() {
    const warning = "Sending token over insecure transport. Assume any token issued is compromised.";
    _log_js__WEBPACK_IMPORTED_MODULE_0__.logger.warning(warning);
    if (typeof process?.emitWarning === "function" && !insecureConnectionWarningEmmitted) {
        insecureConnectionWarningEmmitted = true;
        process.emitWarning(warning);
    }
}
/**
 * Ensures that authentication is only allowed over HTTPS unless explicitly allowed.
 * Throws an error if the connection is not secure and not explicitly allowed.
 */
function ensureSecureConnection(request, options) {
    if (!request.url.toLowerCase().startsWith("https://")) {
        if (allowInsecureConnection(request, options)) {
            emitInsecureConnectionWarning();
        }
        else {
            throw new Error("Authentication is not permitted for non-TLS protected (non-https) URLs when allowInsecureConnection is false.");
        }
    }
}
//# sourceMappingURL=checkInsecureConnection.js.map

/***/ },

/***/ 2155
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   oauth2AuthenticationPolicy: () => (/* binding */ oauth2AuthenticationPolicy),
/* harmony export */   oauth2AuthenticationPolicyName: () => (/* binding */ oauth2AuthenticationPolicyName)
/* harmony export */ });
/* harmony import */ var _checkInsecureConnection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2152);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Name of the OAuth2 Authentication Policy
 */
const oauth2AuthenticationPolicyName = "oauth2AuthenticationPolicy";
/**
 * Gets a pipeline policy that adds authorization header from OAuth2 schemes
 */
function oauth2AuthenticationPolicy(options) {
    return {
        name: oauth2AuthenticationPolicyName,
        async sendRequest(request, next) {
            // Ensure allowInsecureConnection is explicitly set when sending request to non-https URLs
            (0,_checkInsecureConnection_js__WEBPACK_IMPORTED_MODULE_0__.ensureSecureConnection)(request, options);
            const scheme = (request.authSchemes ?? options.authSchemes)?.find((x) => x.kind === "oauth2");
            // Skip adding authentication header if no OAuth2 authentication scheme is found
            if (!scheme) {
                return next(request);
            }
            const token = await options.credential.getOAuth2Token(scheme.flows, {
                abortSignal: request.abortSignal,
            });
            request.headers.set("Authorization", `Bearer ${token}`);
            return next(request);
        },
    };
}
//# sourceMappingURL=oauth2AuthenticationPolicy.js.map

/***/ },

/***/ 2133
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decompressResponsePolicy: () => (/* binding */ decompressResponsePolicy),
/* harmony export */   decompressResponsePolicyName: () => (/* binding */ decompressResponsePolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * The programmatic identifier of the decompressResponsePolicy.
 */
const decompressResponsePolicyName = "decompressResponsePolicy";
/**
 * A policy to enable response decompression according to Accept-Encoding header
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
 */
function decompressResponsePolicy() {
    return {
        name: decompressResponsePolicyName,
        async sendRequest(request, next) {
            // HEAD requests have no body
            if (request.method !== "HEAD") {
                request.headers.set("Accept-Encoding", "gzip,deflate");
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=decompressResponsePolicy.js.map

/***/ },

/***/ 2134
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultRetryPolicy: () => (/* binding */ defaultRetryPolicy),
/* harmony export */   defaultRetryPolicyName: () => (/* binding */ defaultRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2135);
/* harmony import */ var _retryStrategies_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2138);
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2140);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2132);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.




/**
 * Name of the {@link defaultRetryPolicy}
 */
const defaultRetryPolicyName = "defaultRetryPolicy";
/**
 * A policy that retries according to three strategies:
 * - When the server sends a 429 response with a Retry-After header.
 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
 * - Or otherwise if the outgoing request fails, it will retry with an exponentially increasing delay.
 */
function defaultRetryPolicy(options = {}) {
    return {
        name: defaultRetryPolicyName,
        sendRequest: (0,_retryPolicy_js__WEBPACK_IMPORTED_MODULE_2__.retryPolicy)([(0,_retryStrategies_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_1__.throttlingRetryStrategy)(), (0,_retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__.exponentialRetryStrategy)(options)], {
            maxRetries: options.maxRetries ?? _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_RETRY_POLICY_COUNT,
        }).sendRequest,
    };
}
//# sourceMappingURL=defaultRetryPolicy.js.map

/***/ },

/***/ 2167
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exponentialRetryPolicy: () => (/* binding */ exponentialRetryPolicy),
/* harmony export */   exponentialRetryPolicyName: () => (/* binding */ exponentialRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2135);
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2140);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2132);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



/**
 * The programmatic identifier of the exponentialRetryPolicy.
 */
const exponentialRetryPolicyName = "exponentialRetryPolicy";
/**
 * A policy that attempts to retry requests while introducing an exponentially increasing delay.
 * @param options - Options that configure retry logic.
 */
function exponentialRetryPolicy(options = {}) {
    return (0,_retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__.retryPolicy)([
        (0,_retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__.exponentialRetryStrategy)({
            ...options,
            ignoreSystemErrors: true,
        }),
    ], {
        maxRetries: options.maxRetries ?? _constants_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_RETRY_POLICY_COUNT,
    });
}
//# sourceMappingURL=exponentialRetryPolicy.js.map

/***/ },

/***/ 2141
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formDataPolicy: () => (/* binding */ formDataPolicy),
/* harmony export */   formDataPolicyName: () => (/* binding */ formDataPolicyName)
/* harmony export */ });
/* harmony import */ var _util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2120);
/* harmony import */ var _util_checkEnvironment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2142);
/* harmony import */ var _httpHeaders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2109);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



/**
 * The programmatic identifier of the formDataPolicy.
 */
const formDataPolicyName = "formDataPolicy";
function formDataToFormDataMap(formData) {
    const formDataMap = {};
    for (const [key, value] of formData.entries()) {
        formDataMap[key] ??= [];
        formDataMap[key].push(value);
    }
    return formDataMap;
}
/**
 * A policy that encodes FormData on the request into the body.
 */
function formDataPolicy() {
    return {
        name: formDataPolicyName,
        async sendRequest(request, next) {
            if (_util_checkEnvironment_js__WEBPACK_IMPORTED_MODULE_1__.isNodeLike && typeof FormData !== "undefined" && request.body instanceof FormData) {
                request.formData = formDataToFormDataMap(request.body);
                request.body = undefined;
            }
            if (request.formData) {
                const contentType = request.headers.get("Content-Type");
                if (contentType && contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
                    request.body = wwwFormUrlEncode(request.formData);
                }
                else {
                    await prepareFormData(request.formData, request);
                }
                request.formData = undefined;
            }
            return next(request);
        },
    };
}
function wwwFormUrlEncode(formData) {
    const urlSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
        if (Array.isArray(value)) {
            for (const subValue of value) {
                urlSearchParams.append(key, subValue.toString());
            }
        }
        else {
            urlSearchParams.append(key, value.toString());
        }
    }
    return urlSearchParams.toString();
}
async function prepareFormData(formData, request) {
    // validate content type (multipart/form-data)
    const contentType = request.headers.get("Content-Type");
    if (contentType && !contentType.startsWith("multipart/form-data")) {
        // content type is specified and is not multipart/form-data. Exit.
        return;
    }
    request.headers.set("Content-Type", contentType ?? "multipart/form-data");
    // set body to MultipartRequestBody using content from FormDataMap
    const parts = [];
    for (const [fieldName, values] of Object.entries(formData)) {
        for (const value of Array.isArray(values) ? values : [values]) {
            if (typeof value === "string") {
                parts.push({
                    headers: (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_2__.createHttpHeaders)({
                        "Content-Disposition": `form-data; name="${fieldName}"`,
                    }),
                    body: (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(value, "utf-8"),
                });
            }
            else if (value === undefined || value === null || typeof value !== "object") {
                throw new Error(`Unexpected value for key ${fieldName}: ${value}. Value should be serialized to string first.`);
            }
            else {
                // using || instead of ?? here since if value.name is empty we should create a file name
                const fileName = value.name || "blob";
                const headers = (0,_httpHeaders_js__WEBPACK_IMPORTED_MODULE_2__.createHttpHeaders)();
                headers.set("Content-Disposition", `form-data; name="${fieldName}"; filename="${fileName}"`);
                // again, || is used since an empty value.type means the content type is unset
                headers.set("Content-Type", value.type || "application/octet-stream");
                parts.push({
                    headers,
                    body: value,
                });
            }
        }
    }
    request.multipartBody = { parts };
}
//# sourceMappingURL=formDataPolicy.js.map

/***/ },

/***/ 2166
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   agentPolicy: () => (/* reexport safe */ _agentPolicy_js__WEBPACK_IMPORTED_MODULE_0__.agentPolicy),
/* harmony export */   agentPolicyName: () => (/* reexport safe */ _agentPolicy_js__WEBPACK_IMPORTED_MODULE_0__.agentPolicyName),
/* harmony export */   decompressResponsePolicy: () => (/* reexport safe */ _decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_1__.decompressResponsePolicy),
/* harmony export */   decompressResponsePolicyName: () => (/* reexport safe */ _decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_1__.decompressResponsePolicyName),
/* harmony export */   defaultRetryPolicy: () => (/* reexport safe */ _defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_2__.defaultRetryPolicy),
/* harmony export */   defaultRetryPolicyName: () => (/* reexport safe */ _defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_2__.defaultRetryPolicyName),
/* harmony export */   exponentialRetryPolicy: () => (/* reexport safe */ _exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_3__.exponentialRetryPolicy),
/* harmony export */   exponentialRetryPolicyName: () => (/* reexport safe */ _exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_3__.exponentialRetryPolicyName),
/* harmony export */   formDataPolicy: () => (/* reexport safe */ _formDataPolicy_js__WEBPACK_IMPORTED_MODULE_7__.formDataPolicy),
/* harmony export */   formDataPolicyName: () => (/* reexport safe */ _formDataPolicy_js__WEBPACK_IMPORTED_MODULE_7__.formDataPolicyName),
/* harmony export */   getDefaultProxySettings: () => (/* reexport safe */ _proxyPolicy_js__WEBPACK_IMPORTED_MODULE_10__.getDefaultProxySettings),
/* harmony export */   logPolicy: () => (/* reexport safe */ _logPolicy_js__WEBPACK_IMPORTED_MODULE_8__.logPolicy),
/* harmony export */   logPolicyName: () => (/* reexport safe */ _logPolicy_js__WEBPACK_IMPORTED_MODULE_8__.logPolicyName),
/* harmony export */   multipartPolicy: () => (/* reexport safe */ _multipartPolicy_js__WEBPACK_IMPORTED_MODULE_9__.multipartPolicy),
/* harmony export */   multipartPolicyName: () => (/* reexport safe */ _multipartPolicy_js__WEBPACK_IMPORTED_MODULE_9__.multipartPolicyName),
/* harmony export */   proxyPolicy: () => (/* reexport safe */ _proxyPolicy_js__WEBPACK_IMPORTED_MODULE_10__.proxyPolicy),
/* harmony export */   proxyPolicyName: () => (/* reexport safe */ _proxyPolicy_js__WEBPACK_IMPORTED_MODULE_10__.proxyPolicyName),
/* harmony export */   redirectPolicy: () => (/* reexport safe */ _redirectPolicy_js__WEBPACK_IMPORTED_MODULE_11__.redirectPolicy),
/* harmony export */   redirectPolicyName: () => (/* reexport safe */ _redirectPolicy_js__WEBPACK_IMPORTED_MODULE_11__.redirectPolicyName),
/* harmony export */   retryPolicy: () => (/* reexport safe */ _retryPolicy_js__WEBPACK_IMPORTED_MODULE_4__.retryPolicy),
/* harmony export */   systemErrorRetryPolicy: () => (/* reexport safe */ _systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_5__.systemErrorRetryPolicy),
/* harmony export */   systemErrorRetryPolicyName: () => (/* reexport safe */ _systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_5__.systemErrorRetryPolicyName),
/* harmony export */   throttlingRetryPolicy: () => (/* reexport safe */ _throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_6__.throttlingRetryPolicy),
/* harmony export */   throttlingRetryPolicyName: () => (/* reexport safe */ _throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_6__.throttlingRetryPolicyName),
/* harmony export */   tlsPolicy: () => (/* reexport safe */ _tlsPolicy_js__WEBPACK_IMPORTED_MODULE_12__.tlsPolicy),
/* harmony export */   tlsPolicyName: () => (/* reexport safe */ _tlsPolicy_js__WEBPACK_IMPORTED_MODULE_12__.tlsPolicyName),
/* harmony export */   userAgentPolicy: () => (/* reexport safe */ _userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_13__.userAgentPolicy),
/* harmony export */   userAgentPolicyName: () => (/* reexport safe */ _userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_13__.userAgentPolicyName)
/* harmony export */ });
/* harmony import */ var _agentPolicy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2144);
/* harmony import */ var _decompressResponsePolicy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2133);
/* harmony import */ var _defaultRetryPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2134);
/* harmony import */ var _exponentialRetryPolicy_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2167);
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2140);
/* harmony import */ var _systemErrorRetryPolicy_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2168);
/* harmony import */ var _throttlingRetryPolicy_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2169);
/* harmony import */ var _formDataPolicy_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2141);
/* harmony import */ var _logPolicy_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2127);
/* harmony import */ var _multipartPolicy_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2146);
/* harmony import */ var _proxyPolicy_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2143);
/* harmony import */ var _redirectPolicy_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2128);
/* harmony import */ var _tlsPolicy_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(2145);
/* harmony import */ var _userAgentPolicy_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(2129);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.














//# sourceMappingURL=internal.js.map

/***/ },

/***/ 2127
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logPolicy: () => (/* binding */ logPolicy),
/* harmony export */   logPolicyName: () => (/* binding */ logPolicyName)
/* harmony export */ });
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2123);
/* harmony import */ var _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2119);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * The programmatic identifier of the logPolicy.
 */
const logPolicyName = "logPolicy";
/**
 * A policy that logs all requests and responses.
 * @param options - Options to configure logPolicy.
 */
function logPolicy(options = {}) {
    const logger = options.logger ?? _log_js__WEBPACK_IMPORTED_MODULE_0__.logger.info;
    const sanitizer = new _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_1__.Sanitizer({
        additionalAllowedHeaderNames: options.additionalAllowedHeaderNames,
        additionalAllowedQueryParameters: options.additionalAllowedQueryParameters,
    });
    return {
        name: logPolicyName,
        async sendRequest(request, next) {
            if (!logger.enabled) {
                return next(request);
            }
            logger(`Request: ${sanitizer.sanitize(request)}`);
            const response = await next(request);
            logger(`Response status code: ${response.status}`);
            logger(`Headers: ${sanitizer.sanitize(response.headers)}`);
            return response;
        },
    };
}
//# sourceMappingURL=logPolicy.js.map

/***/ },

/***/ 2146
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   multipartPolicy: () => (/* binding */ multipartPolicy),
/* harmony export */   multipartPolicyName: () => (/* binding */ multipartPolicyName)
/* harmony export */ });
/* harmony import */ var _util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2120);
/* harmony import */ var _util_typeGuards_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2147);
/* harmony import */ var _util_uuidUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2113);
/* harmony import */ var _util_concat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2148);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.




function generateBoundary() {
    return `----AzSDKFormBoundary${(0,_util_uuidUtils_js__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}`;
}
function encodeHeaders(headers) {
    let result = "";
    for (const [key, value] of headers) {
        result += `${key}: ${value}\r\n`;
    }
    return result;
}
function getLength(source) {
    if (source instanceof Uint8Array) {
        return source.byteLength;
    }
    else if ((0,_util_typeGuards_js__WEBPACK_IMPORTED_MODULE_1__.isBlob)(source)) {
        // if was created using createFile then -1 means we have an unknown size
        return source.size === -1 ? undefined : source.size;
    }
    else {
        return undefined;
    }
}
function getTotalLength(sources) {
    let total = 0;
    for (const source of sources) {
        const partLength = getLength(source);
        if (partLength === undefined) {
            return undefined;
        }
        else {
            total += partLength;
        }
    }
    return total;
}
async function buildRequestBody(request, parts, boundary) {
    const sources = [
        (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(`--${boundary}`, "utf-8"),
        ...parts.flatMap((part) => [
            (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)("\r\n", "utf-8"),
            (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(encodeHeaders(part.headers), "utf-8"),
            (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)("\r\n", "utf-8"),
            part.body,
            (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)(`\r\n--${boundary}`, "utf-8"),
        ]),
        (0,_util_bytesEncoding_js__WEBPACK_IMPORTED_MODULE_0__.stringToUint8Array)("--\r\n\r\n", "utf-8"),
    ];
    const contentLength = getTotalLength(sources);
    if (contentLength) {
        request.headers.set("Content-Length", contentLength);
    }
    request.body = await (0,_util_concat_js__WEBPACK_IMPORTED_MODULE_3__.concat)(sources);
}
/**
 * Name of multipart policy
 */
const multipartPolicyName = "multipartPolicy";
const maxBoundaryLength = 70;
const validBoundaryCharacters = new Set(`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?`);
function assertValidBoundary(boundary) {
    if (boundary.length > maxBoundaryLength) {
        throw new Error(`Multipart boundary "${boundary}" exceeds maximum length of 70 characters`);
    }
    if (Array.from(boundary).some((x) => !validBoundaryCharacters.has(x))) {
        throw new Error(`Multipart boundary "${boundary}" contains invalid characters`);
    }
}
/**
 * Pipeline policy for multipart requests
 */
function multipartPolicy() {
    return {
        name: multipartPolicyName,
        async sendRequest(request, next) {
            if (!request.multipartBody) {
                return next(request);
            }
            if (request.body) {
                throw new Error("multipartBody and regular body cannot be set at the same time");
            }
            let boundary = request.multipartBody.boundary;
            const contentTypeHeader = request.headers.get("Content-Type") ?? "multipart/mixed";
            const parsedHeader = contentTypeHeader.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
            if (!parsedHeader) {
                throw new Error(`Got multipart request body, but content-type header was not multipart: ${contentTypeHeader}`);
            }
            const [, contentType, parsedBoundary] = parsedHeader;
            if (parsedBoundary && boundary && parsedBoundary !== boundary) {
                throw new Error(`Multipart boundary was specified as ${parsedBoundary} in the header, but got ${boundary} in the request body`);
            }
            boundary ??= parsedBoundary;
            if (boundary) {
                assertValidBoundary(boundary);
            }
            else {
                boundary = generateBoundary();
            }
            request.headers.set("Content-Type", `${contentType}; boundary=${boundary}`);
            await buildRequestBody(request, request.multipartBody.parts, boundary);
            request.multipartBody = undefined;
            return next(request);
        },
    };
}
//# sourceMappingURL=multipartPolicy.js.map

/***/ },

/***/ 2143
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultProxySettings: () => (/* binding */ getDefaultProxySettings),
/* harmony export */   globalNoProxyList: () => (/* binding */ globalNoProxyList),
/* harmony export */   loadNoProxy: () => (/* binding */ loadNoProxy),
/* harmony export */   proxyPolicy: () => (/* binding */ proxyPolicy),
/* harmony export */   proxyPolicyName: () => (/* binding */ proxyPolicyName)
/* harmony export */ });
/* harmony import */ var https_proxy_agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1965);
/* harmony import */ var http_proxy_agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1967);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2123);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



const HTTPS_PROXY = "HTTPS_PROXY";
const HTTP_PROXY = "HTTP_PROXY";
const ALL_PROXY = "ALL_PROXY";
const NO_PROXY = "NO_PROXY";
/**
 * The programmatic identifier of the proxyPolicy.
 */
const proxyPolicyName = "proxyPolicy";
/**
 * Stores the patterns specified in NO_PROXY environment variable.
 * @internal
 */
const globalNoProxyList = [];
let noProxyListLoaded = false;
/** A cache of whether a host should bypass the proxy. */
const globalBypassedMap = new Map();
function getEnvironmentValue(name) {
    if (process.env[name]) {
        return process.env[name];
    }
    else if (process.env[name.toLowerCase()]) {
        return process.env[name.toLowerCase()];
    }
    return undefined;
}
function loadEnvironmentProxyValue() {
    if (!process) {
        return undefined;
    }
    const httpsProxy = getEnvironmentValue(HTTPS_PROXY);
    const allProxy = getEnvironmentValue(ALL_PROXY);
    const httpProxy = getEnvironmentValue(HTTP_PROXY);
    return httpsProxy || allProxy || httpProxy;
}
/**
 * Check whether the host of a given `uri` matches any pattern in the no proxy list.
 * If there's a match, any request sent to the same host shouldn't have the proxy settings set.
 * This implementation is a port of https://github.com/Azure/azure-sdk-for-net/blob/8cca811371159e527159c7eb65602477898683e2/sdk/core/Azure.Core/src/Pipeline/Internal/HttpEnvironmentProxy.cs#L210
 */
function isBypassed(uri, noProxyList, bypassedMap) {
    if (noProxyList.length === 0) {
        return false;
    }
    const host = new URL(uri).hostname;
    if (bypassedMap?.has(host)) {
        return bypassedMap.get(host);
    }
    let isBypassedFlag = false;
    for (const pattern of noProxyList) {
        if (pattern[0] === ".") {
            // This should match either domain it self or any subdomain or host
            // .foo.com will match foo.com it self or *.foo.com
            if (host.endsWith(pattern)) {
                isBypassedFlag = true;
            }
            else {
                if (host.length === pattern.length - 1 && host === pattern.slice(1)) {
                    isBypassedFlag = true;
                }
            }
        }
        else {
            if (host === pattern) {
                isBypassedFlag = true;
            }
        }
    }
    bypassedMap?.set(host, isBypassedFlag);
    return isBypassedFlag;
}
function loadNoProxy() {
    const noProxy = getEnvironmentValue(NO_PROXY);
    noProxyListLoaded = true;
    if (noProxy) {
        return noProxy
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length);
    }
    return [];
}
/**
 * This method converts a proxy url into `ProxySettings` for use with ProxyPolicy.
 * If no argument is given, it attempts to parse a proxy URL from the environment
 * variables `HTTPS_PROXY` or `HTTP_PROXY`.
 * @param proxyUrl - The url of the proxy to use. May contain authentication information.
 * @deprecated - Internally this method is no longer necessary when setting proxy information.
 */
function getDefaultProxySettings(proxyUrl) {
    if (!proxyUrl) {
        proxyUrl = loadEnvironmentProxyValue();
        if (!proxyUrl) {
            return undefined;
        }
    }
    const parsedUrl = new URL(proxyUrl);
    const schema = parsedUrl.protocol ? parsedUrl.protocol + "//" : "";
    return {
        host: schema + parsedUrl.hostname,
        port: Number.parseInt(parsedUrl.port || "80"),
        username: parsedUrl.username,
        password: parsedUrl.password,
    };
}
/**
 * This method attempts to parse a proxy URL from the environment
 * variables `HTTPS_PROXY` or `HTTP_PROXY`.
 */
function getDefaultProxySettingsInternal() {
    const envProxy = loadEnvironmentProxyValue();
    return envProxy ? new URL(envProxy) : undefined;
}
function getUrlFromProxySettings(settings) {
    let parsedProxyUrl;
    try {
        parsedProxyUrl = new URL(settings.host);
    }
    catch {
        throw new Error(`Expecting a valid host string in proxy settings, but found "${settings.host}".`);
    }
    parsedProxyUrl.port = String(settings.port);
    if (settings.username) {
        parsedProxyUrl.username = settings.username;
    }
    if (settings.password) {
        parsedProxyUrl.password = settings.password;
    }
    return parsedProxyUrl;
}
function setProxyAgentOnRequest(request, cachedAgents, proxyUrl) {
    // Custom Agent should take precedence so if one is present
    // we should skip to avoid overwriting it.
    if (request.agent) {
        return;
    }
    const url = new URL(request.url);
    const isInsecure = url.protocol !== "https:";
    if (request.tlsSettings) {
        _log_js__WEBPACK_IMPORTED_MODULE_2__.logger.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
    }
    const headers = request.headers.toJSON();
    if (isInsecure) {
        if (!cachedAgents.httpProxyAgent) {
            cachedAgents.httpProxyAgent = new http_proxy_agent__WEBPACK_IMPORTED_MODULE_1__.HttpProxyAgent(proxyUrl, { headers });
        }
        request.agent = cachedAgents.httpProxyAgent;
    }
    else {
        if (!cachedAgents.httpsProxyAgent) {
            cachedAgents.httpsProxyAgent = new https_proxy_agent__WEBPACK_IMPORTED_MODULE_0__.HttpsProxyAgent(proxyUrl, { headers });
        }
        request.agent = cachedAgents.httpsProxyAgent;
    }
}
/**
 * A policy that allows one to apply proxy settings to all requests.
 * If not passed static settings, they will be retrieved from the HTTPS_PROXY
 * or HTTP_PROXY environment variables.
 * @param proxySettings - ProxySettings to use on each request.
 * @param options - additional settings, for example, custom NO_PROXY patterns
 */
function proxyPolicy(proxySettings, options) {
    if (!noProxyListLoaded) {
        globalNoProxyList.push(...loadNoProxy());
    }
    const defaultProxy = proxySettings
        ? getUrlFromProxySettings(proxySettings)
        : getDefaultProxySettingsInternal();
    const cachedAgents = {};
    return {
        name: proxyPolicyName,
        async sendRequest(request, next) {
            if (!request.proxySettings &&
                defaultProxy &&
                !isBypassed(request.url, options?.customNoProxyList ?? globalNoProxyList, options?.customNoProxyList ? undefined : globalBypassedMap)) {
                setProxyAgentOnRequest(request, cachedAgents, defaultProxy);
            }
            else if (request.proxySettings) {
                setProxyAgentOnRequest(request, cachedAgents, getUrlFromProxySettings(request.proxySettings));
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=proxyPolicy.js.map

/***/ },

/***/ 2128
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   redirectPolicy: () => (/* binding */ redirectPolicy),
/* harmony export */   redirectPolicyName: () => (/* binding */ redirectPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * The programmatic identifier of the redirectPolicy.
 */
const redirectPolicyName = "redirectPolicy";
/**
 * Methods that are allowed to follow redirects 301 and 302
 */
const allowedRedirect = ["GET", "HEAD"];
/**
 * A policy to follow Location headers from the server in order
 * to support server-side redirection.
 * In the browser, this policy is not used.
 * @param options - Options to control policy behavior.
 */
function redirectPolicy(options = {}) {
    const { maxRetries = 20 } = options;
    return {
        name: redirectPolicyName,
        async sendRequest(request, next) {
            const response = await next(request);
            return handleRedirect(next, response, maxRetries);
        },
    };
}
async function handleRedirect(next, response, maxRetries, currentRetries = 0) {
    const { request, status, headers } = response;
    const locationHeader = headers.get("location");
    if (locationHeader &&
        (status === 300 ||
            (status === 301 && allowedRedirect.includes(request.method)) ||
            (status === 302 && allowedRedirect.includes(request.method)) ||
            (status === 303 && request.method === "POST") ||
            status === 307) &&
        currentRetries < maxRetries) {
        const url = new URL(locationHeader, request.url);
        request.url = url.toString();
        // POST request with Status code 303 should be converted into a
        // redirected GET request if the redirect url is present in the location header
        if (status === 303) {
            request.method = "GET";
            request.headers.delete("Content-Length");
            delete request.body;
        }
        request.headers.delete("Authorization");
        const res = await next(request);
        return handleRedirect(next, res, maxRetries, currentRetries + 1);
    }
    return response;
}
//# sourceMappingURL=redirectPolicy.js.map

/***/ },

/***/ 2140
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   retryPolicy: () => (/* binding */ retryPolicy)
/* harmony export */ });
/* harmony import */ var _util_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2139);
/* harmony import */ var _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2105);
/* harmony import */ var _logger_logger_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2106);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2132);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.




const retryPolicyLogger = (0,_logger_logger_js__WEBPACK_IMPORTED_MODULE_2__.createClientLogger)("ts-http-runtime retryPolicy");
/**
 * The programmatic identifier of the retryPolicy.
 */
const retryPolicyName = "retryPolicy";
/**
 * retryPolicy is a generic policy to enable retrying requests when certain conditions are met
 */
function retryPolicy(strategies, options = { maxRetries: _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_RETRY_POLICY_COUNT }) {
    const logger = options.logger || retryPolicyLogger;
    return {
        name: retryPolicyName,
        async sendRequest(request, next) {
            let response;
            let responseError;
            let retryCount = -1;
            retryRequest: while (true) {
                retryCount += 1;
                response = undefined;
                responseError = undefined;
                try {
                    logger.info(`Retry ${retryCount}: Attempting to send request`, request.requestId);
                    response = await next(request);
                    logger.info(`Retry ${retryCount}: Received a response from request`, request.requestId);
                }
                catch (e) {
                    logger.error(`Retry ${retryCount}: Received an error from request`, request.requestId);
                    // RestErrors are valid targets for the retry strategies.
                    // If none of the retry strategies can work with them, they will be thrown later in this policy.
                    // If the received error is not a RestError, it is immediately thrown.
                    responseError = e;
                    if (!e || responseError.name !== "RestError") {
                        throw e;
                    }
                    response = responseError.response;
                }
                if (request.abortSignal?.aborted) {
                    logger.error(`Retry ${retryCount}: Request aborted.`);
                    const abortError = new _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_1__.AbortError();
                    throw abortError;
                }
                if (retryCount >= (options.maxRetries ?? _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_RETRY_POLICY_COUNT)) {
                    logger.info(`Retry ${retryCount}: Maximum retries reached. Returning the last received response, or throwing the last received error.`);
                    if (responseError) {
                        throw responseError;
                    }
                    else if (response) {
                        return response;
                    }
                    else {
                        throw new Error("Maximum retries reached with no response or error to throw");
                    }
                }
                logger.info(`Retry ${retryCount}: Processing ${strategies.length} retry strategies.`);
                strategiesLoop: for (const strategy of strategies) {
                    const strategyLogger = strategy.logger || logger;
                    strategyLogger.info(`Retry ${retryCount}: Processing retry strategy ${strategy.name}.`);
                    const modifiers = strategy.retry({
                        retryCount,
                        response,
                        responseError,
                    });
                    if (modifiers.skipStrategy) {
                        strategyLogger.info(`Retry ${retryCount}: Skipped.`);
                        continue strategiesLoop;
                    }
                    const { errorToThrow, retryAfterInMs, redirectTo } = modifiers;
                    if (errorToThrow) {
                        strategyLogger.error(`Retry ${retryCount}: Retry strategy ${strategy.name} throws error:`, errorToThrow);
                        throw errorToThrow;
                    }
                    if (retryAfterInMs || retryAfterInMs === 0) {
                        strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} retries after ${retryAfterInMs}`);
                        await (0,_util_helpers_js__WEBPACK_IMPORTED_MODULE_0__.delay)(retryAfterInMs, undefined, { abortSignal: request.abortSignal });
                        continue retryRequest;
                    }
                    if (redirectTo) {
                        strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} redirects to ${redirectTo}`);
                        request.url = redirectTo;
                        continue retryRequest;
                    }
                }
                if (responseError) {
                    logger.info(`None of the retry strategies could work with the received error. Throwing it.`);
                    throw responseError;
                }
                if (response) {
                    logger.info(`None of the retry strategies could work with the received response. Returning it.`);
                    return response;
                }
                // If all the retries skip and there's no response,
                // we're still in the retry loop, so a new request will be sent
                // until `maxRetries` is reached.
            }
        },
    };
}
//# sourceMappingURL=retryPolicy.js.map

/***/ },

/***/ 2168
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   systemErrorRetryPolicy: () => (/* binding */ systemErrorRetryPolicy),
/* harmony export */   systemErrorRetryPolicyName: () => (/* binding */ systemErrorRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2135);
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2140);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2132);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



/**
 * Name of the {@link systemErrorRetryPolicy}
 */
const systemErrorRetryPolicyName = "systemErrorRetryPolicy";
/**
 * A retry policy that specifically seeks to handle errors in the
 * underlying transport layer (e.g. DNS lookup failures) rather than
 * retryable error codes from the server itself.
 * @param options - Options that customize the policy.
 */
function systemErrorRetryPolicy(options = {}) {
    return {
        name: systemErrorRetryPolicyName,
        sendRequest: (0,_retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__.retryPolicy)([
            (0,_retryStrategies_exponentialRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__.exponentialRetryStrategy)({
                ...options,
                ignoreHttpStatusCodes: true,
            }),
        ], {
            maxRetries: options.maxRetries ?? _constants_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_RETRY_POLICY_COUNT,
        }).sendRequest,
    };
}
//# sourceMappingURL=systemErrorRetryPolicy.js.map

/***/ },

/***/ 2169
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   throttlingRetryPolicy: () => (/* binding */ throttlingRetryPolicy),
/* harmony export */   throttlingRetryPolicyName: () => (/* binding */ throttlingRetryPolicyName)
/* harmony export */ });
/* harmony import */ var _retryStrategies_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2138);
/* harmony import */ var _retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2140);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2132);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



/**
 * Name of the {@link throttlingRetryPolicy}
 */
const throttlingRetryPolicyName = "throttlingRetryPolicy";
/**
 * A policy that retries when the server sends a 429 response with a Retry-After header.
 *
 * To learn more, please refer to
 * https://learn.microsoft.com/azure/azure-resource-manager/resource-manager-request-limits,
 * https://learn.microsoft.com/azure/azure-subscription-service-limits and
 * https://learn.microsoft.com/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
 *
 * @param options - Options that configure retry logic.
 */
function throttlingRetryPolicy(options = {}) {
    return {
        name: throttlingRetryPolicyName,
        sendRequest: (0,_retryPolicy_js__WEBPACK_IMPORTED_MODULE_1__.retryPolicy)([(0,_retryStrategies_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_0__.throttlingRetryStrategy)()], {
            maxRetries: options.maxRetries ?? _constants_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_RETRY_POLICY_COUNT,
        }).sendRequest,
    };
}
//# sourceMappingURL=throttlingRetryPolicy.js.map

/***/ },

/***/ 2145
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tlsPolicy: () => (/* binding */ tlsPolicy),
/* harmony export */   tlsPolicyName: () => (/* binding */ tlsPolicyName)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Name of the TLS Policy
 */
const tlsPolicyName = "tlsPolicy";
/**
 * Gets a pipeline policy that adds the client certificate to the HttpClient agent for authentication.
 */
function tlsPolicy(tlsSettings) {
    return {
        name: tlsPolicyName,
        sendRequest: async (req, next) => {
            // Users may define a request tlsSettings, honor those over the client level one
            if (!req.tlsSettings) {
                req.tlsSettings = tlsSettings;
            }
            return next(req);
        },
    };
}
//# sourceMappingURL=tlsPolicy.js.map

/***/ },

/***/ 2129
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   userAgentPolicy: () => (/* binding */ userAgentPolicy),
/* harmony export */   userAgentPolicyName: () => (/* binding */ userAgentPolicyName)
/* harmony export */ });
/* harmony import */ var _util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2130);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const UserAgentHeaderName = (0,_util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeaderName)();
/**
 * The programmatic identifier of the userAgentPolicy.
 */
const userAgentPolicyName = "userAgentPolicy";
/**
 * A policy that sets the User-Agent header (or equivalent) to reflect
 * the library version.
 * @param options - Options to customize the user agent value.
 */
function userAgentPolicy(options = {}) {
    const userAgentValue = (0,_util_userAgent_js__WEBPACK_IMPORTED_MODULE_0__.getUserAgentValue)(options.userAgentPrefix);
    return {
        name: userAgentPolicyName,
        async sendRequest(request, next) {
            if (!request.headers.has(UserAgentHeaderName)) {
                request.headers.set(UserAgentHeaderName, await userAgentValue);
            }
            return next(request);
        },
    };
}
//# sourceMappingURL=userAgentPolicy.js.map

/***/ },

/***/ 2115
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RestError: () => (/* binding */ RestError),
/* harmony export */   isRestError: () => (/* binding */ isRestError)
/* harmony export */ });
/* harmony import */ var _util_error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2116);
/* harmony import */ var _util_inspect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2118);
/* harmony import */ var _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2119);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



const errorSanitizer = new _util_sanitizer_js__WEBPACK_IMPORTED_MODULE_2__.Sanitizer();
/**
 * A custom error type for failed pipeline requests.
 */
class RestError extends Error {
    /**
     * Something went wrong when making the request.
     * This means the actual request failed for some reason,
     * such as a DNS issue or the connection being lost.
     */
    static REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
    /**
     * This means that parsing the response from the server failed.
     * It may have been malformed.
     */
    static PARSE_ERROR = "PARSE_ERROR";
    /**
     * The code of the error itself (use statics on RestError if possible.)
     */
    code;
    /**
     * The HTTP status code of the request (if applicable.)
     */
    statusCode;
    /**
     * The request that was made.
     * This property is non-enumerable.
     */
    request;
    /**
     * The response received (if any.)
     * This property is non-enumerable.
     */
    response;
    /**
     * Bonus property set by the throw site.
     */
    details;
    constructor(message, options = {}) {
        super(message);
        this.name = "RestError";
        this.code = options.code;
        this.statusCode = options.statusCode;
        // The request and response may contain sensitive information in the headers or body.
        // To help prevent this sensitive information being accidentally logged, the request and response
        // properties are marked as non-enumerable here. This prevents them showing up in the output of
        // JSON.stringify and console.log.
        Object.defineProperty(this, "request", { value: options.request, enumerable: false });
        Object.defineProperty(this, "response", { value: options.response, enumerable: false });
        // Only include useful agent information in the request for logging, as the full agent object
        // may contain large binary data.
        const agent = this.request?.agent
            ? {
                maxFreeSockets: this.request.agent.maxFreeSockets,
                maxSockets: this.request.agent.maxSockets,
            }
            : undefined;
        // Logging method for util.inspect in Node
        Object.defineProperty(this, _util_inspect_js__WEBPACK_IMPORTED_MODULE_1__.custom, {
            value: () => {
                // Extract non-enumerable properties and add them back. This is OK since in this output the request and
                // response get sanitized.
                return `RestError: ${this.message} \n ${errorSanitizer.sanitize({
                    ...this,
                    request: { ...this.request, agent },
                    response: this.response,
                })}`;
            },
            enumerable: false,
        });
        Object.setPrototypeOf(this, RestError.prototype);
    }
}
/**
 * Typeguard for RestError
 * @param e - Something caught by a catch clause.
 */
function isRestError(e) {
    if (e instanceof RestError) {
        return true;
    }
    return (0,_util_error_js__WEBPACK_IMPORTED_MODULE_0__.isError)(e) && e.name === "RestError";
}
//# sourceMappingURL=restError.js.map

/***/ },

/***/ 2135
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exponentialRetryStrategy: () => (/* binding */ exponentialRetryStrategy),
/* harmony export */   isExponentialRetryResponse: () => (/* binding */ isExponentialRetryResponse),
/* harmony export */   isSystemError: () => (/* binding */ isSystemError)
/* harmony export */ });
/* harmony import */ var _util_delay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2136);
/* harmony import */ var _throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2138);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


// intervals are in milliseconds
const DEFAULT_CLIENT_RETRY_INTERVAL = 1000;
const DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 64;
/**
 * A retry strategy that retries with an exponentially increasing delay in these two cases:
 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
 * - Or otherwise if the outgoing request fails (408, greater or equal than 500, except for 501 and 505).
 */
function exponentialRetryStrategy(options = {}) {
    const retryInterval = options.retryDelayInMs ?? DEFAULT_CLIENT_RETRY_INTERVAL;
    const maxRetryInterval = options.maxRetryDelayInMs ?? DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
    return {
        name: "exponentialRetryStrategy",
        retry({ retryCount, response, responseError }) {
            const matchedSystemError = isSystemError(responseError);
            const ignoreSystemErrors = matchedSystemError && options.ignoreSystemErrors;
            const isExponential = isExponentialRetryResponse(response);
            const ignoreExponentialResponse = isExponential && options.ignoreHttpStatusCodes;
            const unknownResponse = response && ((0,_throttlingRetryStrategy_js__WEBPACK_IMPORTED_MODULE_1__.isThrottlingRetryResponse)(response) || !isExponential);
            if (unknownResponse || ignoreExponentialResponse || ignoreSystemErrors) {
                return { skipStrategy: true };
            }
            if (responseError && !matchedSystemError && !isExponential) {
                return { errorToThrow: responseError };
            }
            return (0,_util_delay_js__WEBPACK_IMPORTED_MODULE_0__.calculateRetryDelay)(retryCount, {
                retryDelayInMs: retryInterval,
                maxRetryDelayInMs: maxRetryInterval,
            });
        },
    };
}
/**
 * A response is a retry response if it has status codes:
 * - 408, or
 * - Greater or equal than 500, except for 501 and 505.
 */
function isExponentialRetryResponse(response) {
    return Boolean(response &&
        response.status !== undefined &&
        (response.status >= 500 || response.status === 408) &&
        response.status !== 501 &&
        response.status !== 505);
}
/**
 * Determines whether an error from a pipeline response was triggered in the network layer.
 */
function isSystemError(err) {
    if (!err) {
        return false;
    }
    return (err.code === "ETIMEDOUT" ||
        err.code === "ESOCKETTIMEDOUT" ||
        err.code === "ECONNREFUSED" ||
        err.code === "ECONNRESET" ||
        err.code === "ENOENT" ||
        err.code === "ENOTFOUND");
}
//# sourceMappingURL=exponentialRetryStrategy.js.map

/***/ },

/***/ 2138
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isThrottlingRetryResponse: () => (/* binding */ isThrottlingRetryResponse),
/* harmony export */   throttlingRetryStrategy: () => (/* binding */ throttlingRetryStrategy)
/* harmony export */ });
/* harmony import */ var _util_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2139);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * The header that comes back from services representing
 * the amount of time (minimum) to wait to retry (in seconds or timestamp after which we can retry).
 */
const RetryAfterHeader = "Retry-After";
/**
 * The headers that come back from services representing
 * the amount of time (minimum) to wait to retry.
 *
 * "retry-after-ms", "x-ms-retry-after-ms" : milliseconds
 * "Retry-After" : seconds or timestamp
 */
const AllRetryAfterHeaders = ["retry-after-ms", "x-ms-retry-after-ms", RetryAfterHeader];
/**
 * A response is a throttling retry response if it has a throttling status code (429 or 503),
 * as long as one of the [ "Retry-After" or "retry-after-ms" or "x-ms-retry-after-ms" ] headers has a valid value.
 *
 * Returns the `retryAfterInMs` value if the response is a throttling retry response.
 * If not throttling retry response, returns `undefined`.
 *
 * @internal
 */
function getRetryAfterInMs(response) {
    if (!(response && [429, 503].includes(response.status)))
        return undefined;
    try {
        // Headers: "retry-after-ms", "x-ms-retry-after-ms", "Retry-After"
        for (const header of AllRetryAfterHeaders) {
            const retryAfterValue = (0,_util_helpers_js__WEBPACK_IMPORTED_MODULE_0__.parseHeaderValueAsNumber)(response, header);
            if (retryAfterValue === 0 || retryAfterValue) {
                // "Retry-After" header ==> seconds
                // "retry-after-ms", "x-ms-retry-after-ms" headers ==> milli-seconds
                const multiplyingFactor = header === RetryAfterHeader ? 1000 : 1;
                return retryAfterValue * multiplyingFactor; // in milli-seconds
            }
        }
        // RetryAfterHeader ("Retry-After") has a special case where it might be formatted as a date instead of a number of seconds
        const retryAfterHeader = response.headers.get(RetryAfterHeader);
        if (!retryAfterHeader)
            return;
        const date = Date.parse(retryAfterHeader);
        const diff = date - Date.now();
        // negative diff would mean a date in the past, so retry asap with 0 milliseconds
        return Number.isFinite(diff) ? Math.max(0, diff) : undefined;
    }
    catch {
        return undefined;
    }
}
/**
 * A response is a retry response if it has a throttling status code (429 or 503),
 * as long as one of the [ "Retry-After" or "retry-after-ms" or "x-ms-retry-after-ms" ] headers has a valid value.
 */
function isThrottlingRetryResponse(response) {
    return Number.isFinite(getRetryAfterInMs(response));
}
function throttlingRetryStrategy() {
    return {
        name: "throttlingRetryStrategy",
        retry({ response }) {
            const retryAfterInMs = getRetryAfterInMs(response);
            if (!Number.isFinite(retryAfterInMs)) {
                return { skipStrategy: true };
            }
            return {
                retryAfterInMs,
            };
        },
    };
}
//# sourceMappingURL=throttlingRetryStrategy.js.map

/***/ },

/***/ 2120
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   stringToUint8Array: () => (/* binding */ stringToUint8Array),
/* harmony export */   uint8ArrayToString: () => (/* binding */ uint8ArrayToString)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * The helper that transforms bytes with specific character encoding into string
 * @param bytes - the uint8array bytes
 * @param format - the format we use to encode the byte
 * @returns a string of the encoded string
 */
function uint8ArrayToString(bytes, format) {
    return Buffer.from(bytes).toString(format);
}
/**
 * The helper that transforms string to specific character encoded bytes array.
 * @param value - the string to be converted
 * @param format - the format we use to decode the value
 * @returns a uint8array
 */
function stringToUint8Array(value, format) {
    return Buffer.from(value, format);
}
//# sourceMappingURL=bytesEncoding.js.map

/***/ },

/***/ 2142
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   isBun: () => (/* binding */ isBun),
/* harmony export */   isDeno: () => (/* binding */ isDeno),
/* harmony export */   isNodeLike: () => (/* binding */ isNodeLike),
/* harmony export */   isNodeRuntime: () => (/* binding */ isNodeRuntime),
/* harmony export */   isReactNative: () => (/* binding */ isReactNative),
/* harmony export */   isWebWorker: () => (/* binding */ isWebWorker)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * A constant that indicates whether the environment the code is running is a Web Browser.
 */
// eslint-disable-next-line @azure/azure-sdk/ts-no-window
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
/**
 * A constant that indicates whether the environment the code is running is a Web Worker.
 */
const isWebWorker = typeof self === "object" &&
    typeof self?.importScripts === "function" &&
    (self.constructor?.name === "DedicatedWorkerGlobalScope" ||
        self.constructor?.name === "ServiceWorkerGlobalScope" ||
        self.constructor?.name === "SharedWorkerGlobalScope");
/**
 * A constant that indicates whether the environment the code is running is Deno.
 */
const isDeno = typeof Deno !== "undefined" &&
    typeof Deno.version !== "undefined" &&
    typeof Deno.version.deno !== "undefined";
/**
 * A constant that indicates whether the environment the code is running is Bun.sh.
 */
const isBun = typeof Bun !== "undefined" && typeof Bun.version !== "undefined";
/**
 * A constant that indicates whether the environment the code is running is a Node.js compatible environment.
 */
const isNodeLike = typeof globalThis.process !== "undefined" &&
    Boolean(globalThis.process.version) &&
    Boolean(globalThis.process.versions?.node);
/**
 * A constant that indicates whether the environment the code is running is Node.JS.
 */
const isNodeRuntime = isNodeLike && !isBun && !isDeno;
/**
 * A constant that indicates whether the environment the code is running is in React-Native.
 */
// https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/setUpNavigator.js
const isReactNative = typeof navigator !== "undefined" && navigator?.product === "ReactNative";
//# sourceMappingURL=checkEnvironment.js.map

/***/ },

/***/ 2148
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   concat: () => (/* binding */ concat)
/* harmony export */ });
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73);
/* harmony import */ var _typeGuards_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2147);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


async function* streamAsyncIterator() {
    const reader = this.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                return;
            }
            yield value;
        }
    }
    finally {
        reader.releaseLock();
    }
}
function makeAsyncIterable(webStream) {
    if (!webStream[Symbol.asyncIterator]) {
        webStream[Symbol.asyncIterator] = streamAsyncIterator.bind(webStream);
    }
    if (!webStream.values) {
        webStream.values = streamAsyncIterator.bind(webStream);
    }
}
function ensureNodeStream(stream) {
    if (stream instanceof ReadableStream) {
        makeAsyncIterable(stream);
        return stream__WEBPACK_IMPORTED_MODULE_0__.Readable.fromWeb(stream);
    }
    else {
        return stream;
    }
}
function toStream(source) {
    if (source instanceof Uint8Array) {
        return stream__WEBPACK_IMPORTED_MODULE_0__.Readable.from(Buffer.from(source));
    }
    else if ((0,_typeGuards_js__WEBPACK_IMPORTED_MODULE_1__.isBlob)(source)) {
        return ensureNodeStream(source.stream());
    }
    else {
        return ensureNodeStream(source);
    }
}
/**
 * Utility function that concatenates a set of binary inputs into one combined output.
 *
 * @param sources - array of sources for the concatenation
 * @returns - in Node, a (() =\> NodeJS.ReadableStream) which, when read, produces a concatenation of all the inputs.
 *           In browser, returns a `Blob` representing all the concatenated inputs.
 *
 * @internal
 */
async function concat(sources) {
    return function () {
        const streams = sources.map((x) => (typeof x === "function" ? x() : x)).map(toStream);
        return stream__WEBPACK_IMPORTED_MODULE_0__.Readable.from((async function* () {
            for (const stream of streams) {
                for await (const chunk of stream) {
                    yield chunk;
                }
            }
        })());
    };
}
//# sourceMappingURL=concat.js.map

/***/ },

/***/ 2136
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateRetryDelay: () => (/* binding */ calculateRetryDelay)
/* harmony export */ });
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2137);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Calculates the delay interval for retry attempts using exponential delay with jitter.
 * @param retryAttempt - The current retry attempt number.
 * @param config - The exponential retry configuration.
 * @returns An object containing the calculated retry delay.
 */
function calculateRetryDelay(retryAttempt, config) {
    // Exponentially increase the delay each time
    const exponentialDelay = config.retryDelayInMs * Math.pow(2, retryAttempt);
    // Don't let the delay exceed the maximum
    const clampedDelay = Math.min(config.maxRetryDelayInMs, exponentialDelay);
    // Allow the final value to have some "jitter" (within 50% of the delay size) so
    // that retries across multiple clients don't occur simultaneously.
    const retryAfterInMs = clampedDelay / 2 + (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.getRandomIntegerInclusive)(0, clampedDelay / 2);
    return { retryAfterInMs };
}
//# sourceMappingURL=delay.js.map

/***/ },

/***/ 2116
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isError: () => (/* binding */ isError)
/* harmony export */ });
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2117);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Typeguard for an error object shape (has name and message)
 * @param e - Something caught by a catch clause.
 */
function isError(e) {
    if ((0,_object_js__WEBPACK_IMPORTED_MODULE_0__.isObject)(e)) {
        const hasName = typeof e.name === "string";
        const hasMessage = typeof e.message === "string";
        return hasName && hasMessage;
    }
    return false;
}
//# sourceMappingURL=error.js.map

/***/ },

/***/ 2139
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   delay: () => (/* binding */ delay),
/* harmony export */   parseHeaderValueAsNumber: () => (/* binding */ parseHeaderValueAsNumber)
/* harmony export */ });
/* harmony import */ var _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2105);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const StandardAbortMessage = "The operation was aborted.";
/**
 * A wrapper for setTimeout that resolves a promise after delayInMs milliseconds.
 * @param delayInMs - The number of milliseconds to be delayed.
 * @param value - The value to be resolved with after a timeout of t milliseconds.
 * @param options - The options for delay - currently abort options
 *                  - abortSignal - The abortSignal associated with containing operation.
 *                  - abortErrorMsg - The abort error message associated with containing operation.
 * @returns Resolved promise
 */
function delay(delayInMs, value, options) {
    return new Promise((resolve, reject) => {
        let timer = undefined;
        let onAborted = undefined;
        const rejectOnAbort = () => {
            return reject(new _abort_controller_AbortError_js__WEBPACK_IMPORTED_MODULE_0__.AbortError(options?.abortErrorMsg ? options?.abortErrorMsg : StandardAbortMessage));
        };
        const removeListeners = () => {
            if (options?.abortSignal && onAborted) {
                options.abortSignal.removeEventListener("abort", onAborted);
            }
        };
        onAborted = () => {
            if (timer) {
                clearTimeout(timer);
            }
            removeListeners();
            return rejectOnAbort();
        };
        if (options?.abortSignal && options.abortSignal.aborted) {
            return rejectOnAbort();
        }
        timer = setTimeout(() => {
            removeListeners();
            resolve(value);
        }, delayInMs);
        if (options?.abortSignal) {
            options.abortSignal.addEventListener("abort", onAborted);
        }
    });
}
/**
 * @internal
 * @returns the parsed value or undefined if the parsed value is invalid.
 */
function parseHeaderValueAsNumber(response, headerName) {
    const value = response.headers.get(headerName);
    if (!value)
        return;
    const valueAsNum = Number(value);
    if (Number.isNaN(valueAsNum))
        return;
    return valueAsNum;
}
//# sourceMappingURL=helpers.js.map

/***/ },

/***/ 2118
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   custom: () => (/* binding */ custom)
/* harmony export */ });
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1447);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const custom = node_util__WEBPACK_IMPORTED_MODULE_0__.inspect.custom;
//# sourceMappingURL=inspect.js.map

/***/ },

/***/ 2178
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sanitizer: () => (/* reexport safe */ _sanitizer_js__WEBPACK_IMPORTED_MODULE_8__.Sanitizer),
/* harmony export */   calculateRetryDelay: () => (/* reexport safe */ _delay_js__WEBPACK_IMPORTED_MODULE_0__.calculateRetryDelay),
/* harmony export */   computeSha256Hash: () => (/* reexport safe */ _sha256_js__WEBPACK_IMPORTED_MODULE_4__.computeSha256Hash),
/* harmony export */   computeSha256Hmac: () => (/* reexport safe */ _sha256_js__WEBPACK_IMPORTED_MODULE_4__.computeSha256Hmac),
/* harmony export */   getRandomIntegerInclusive: () => (/* reexport safe */ _random_js__WEBPACK_IMPORTED_MODULE_1__.getRandomIntegerInclusive),
/* harmony export */   isBrowser: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_6__.isBrowser),
/* harmony export */   isBun: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_6__.isBun),
/* harmony export */   isDeno: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_6__.isDeno),
/* harmony export */   isError: () => (/* reexport safe */ _error_js__WEBPACK_IMPORTED_MODULE_3__.isError),
/* harmony export */   isNodeLike: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_6__.isNodeLike),
/* harmony export */   isNodeRuntime: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_6__.isNodeRuntime),
/* harmony export */   isObject: () => (/* reexport safe */ _object_js__WEBPACK_IMPORTED_MODULE_2__.isObject),
/* harmony export */   isReactNative: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_6__.isReactNative),
/* harmony export */   isWebWorker: () => (/* reexport safe */ _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_6__.isWebWorker),
/* harmony export */   randomUUID: () => (/* reexport safe */ _uuidUtils_js__WEBPACK_IMPORTED_MODULE_5__.randomUUID),
/* harmony export */   stringToUint8Array: () => (/* reexport safe */ _bytesEncoding_js__WEBPACK_IMPORTED_MODULE_7__.stringToUint8Array),
/* harmony export */   uint8ArrayToString: () => (/* reexport safe */ _bytesEncoding_js__WEBPACK_IMPORTED_MODULE_7__.uint8ArrayToString)
/* harmony export */ });
/* harmony import */ var _delay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2136);
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2137);
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2117);
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2116);
/* harmony import */ var _sha256_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2179);
/* harmony import */ var _uuidUtils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2113);
/* harmony import */ var _checkEnvironment_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2142);
/* harmony import */ var _bytesEncoding_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2120);
/* harmony import */ var _sanitizer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2119);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.









//# sourceMappingURL=internal.js.map

/***/ },

/***/ 2117
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isObject: () => (/* binding */ isObject)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Helper to determine when an input is a generic JS object.
 * @returns true when input is an object type that is not null, Array, RegExp, or Date.
 */
function isObject(input) {
    return (typeof input === "object" &&
        input !== null &&
        !Array.isArray(input) &&
        !(input instanceof RegExp) &&
        !(input instanceof Date));
}
//# sourceMappingURL=object.js.map

/***/ },

/***/ 2137
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRandomIntegerInclusive: () => (/* binding */ getRandomIntegerInclusive)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Returns a random integer value between a lower and upper bound,
 * inclusive of both bounds.
 * Note that this uses Math.random and isn't secure. If you need to use
 * this for any kind of security purpose, find a better source of random.
 * @param min - The smallest integer value allowed.
 * @param max - The largest integer value allowed.
 */
function getRandomIntegerInclusive(min, max) {
    // Make sure inputs are integers.
    min = Math.ceil(min);
    max = Math.floor(max);
    // Pick a random offset from zero to the size of the range.
    // Since Math.random() can never return 1, we have to make the range one larger
    // in order to be inclusive of the maximum value after we take the floor.
    const offset = Math.floor(Math.random() * (max - min + 1));
    return offset + min;
}
//# sourceMappingURL=random.js.map

/***/ },

/***/ 2119
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sanitizer: () => (/* binding */ Sanitizer)
/* harmony export */ });
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2117);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const RedactedString = "REDACTED";
// Make sure this list is up-to-date with the one under core/logger/Readme#Keyconcepts
const defaultAllowedHeaderNames = [
    "x-ms-client-request-id",
    "x-ms-return-client-request-id",
    "x-ms-useragent",
    "x-ms-correlation-request-id",
    "x-ms-request-id",
    "client-request-id",
    "ms-cv",
    "return-client-request-id",
    "traceparent",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Origin",
    "Access-Control-Expose-Headers",
    "Access-Control-Max-Age",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
    "Origin",
    "Accept",
    "Accept-Encoding",
    "Cache-Control",
    "Connection",
    "Content-Length",
    "Content-Type",
    "Date",
    "ETag",
    "Expires",
    "If-Match",
    "If-Modified-Since",
    "If-None-Match",
    "If-Unmodified-Since",
    "Last-Modified",
    "Pragma",
    "Request-Id",
    "Retry-After",
    "Server",
    "Transfer-Encoding",
    "User-Agent",
    "WWW-Authenticate",
];
const defaultAllowedQueryParameters = ["api-version"];
/**
 * A utility class to sanitize objects for logging.
 */
class Sanitizer {
    allowedHeaderNames;
    allowedQueryParameters;
    constructor({ additionalAllowedHeaderNames: allowedHeaderNames = [], additionalAllowedQueryParameters: allowedQueryParameters = [], } = {}) {
        allowedHeaderNames = defaultAllowedHeaderNames.concat(allowedHeaderNames);
        allowedQueryParameters = defaultAllowedQueryParameters.concat(allowedQueryParameters);
        this.allowedHeaderNames = new Set(allowedHeaderNames.map((n) => n.toLowerCase()));
        this.allowedQueryParameters = new Set(allowedQueryParameters.map((p) => p.toLowerCase()));
    }
    /**
     * Sanitizes an object for logging.
     * @param obj - The object to sanitize
     * @returns - The sanitized object as a string
     */
    sanitize(obj) {
        const seen = new Set();
        return JSON.stringify(obj, (key, value) => {
            // Ensure Errors include their interesting non-enumerable members
            if (value instanceof Error) {
                return {
                    ...value,
                    name: value.name,
                    message: value.message,
                };
            }
            if (key === "headers") {
                return this.sanitizeHeaders(value);
            }
            else if (key === "url") {
                return this.sanitizeUrl(value);
            }
            else if (key === "query") {
                return this.sanitizeQuery(value);
            }
            else if (key === "body") {
                // Don't log the request body
                return undefined;
            }
            else if (key === "response") {
                // Don't log response again
                return undefined;
            }
            else if (key === "operationSpec") {
                // When using sendOperationRequest, the request carries a massive
                // field with the autorest spec. No need to log it.
                return undefined;
            }
            else if (Array.isArray(value) || (0,_object_js__WEBPACK_IMPORTED_MODULE_0__.isObject)(value)) {
                if (seen.has(value)) {
                    return "[Circular]";
                }
                seen.add(value);
            }
            return value;
        }, 2);
    }
    /**
     * Sanitizes a URL for logging.
     * @param value - The URL to sanitize
     * @returns - The sanitized URL as a string
     */
    sanitizeUrl(value) {
        if (typeof value !== "string" || value === null || value === "") {
            return value;
        }
        const url = new URL(value);
        if (!url.search) {
            return value;
        }
        for (const [key] of url.searchParams) {
            if (!this.allowedQueryParameters.has(key.toLowerCase())) {
                url.searchParams.set(key, RedactedString);
            }
        }
        return url.toString();
    }
    sanitizeHeaders(obj) {
        const sanitized = {};
        for (const key of Object.keys(obj)) {
            if (this.allowedHeaderNames.has(key.toLowerCase())) {
                sanitized[key] = obj[key];
            }
            else {
                sanitized[key] = RedactedString;
            }
        }
        return sanitized;
    }
    sanitizeQuery(value) {
        if (typeof value !== "object" || value === null) {
            return value;
        }
        const sanitized = {};
        for (const k of Object.keys(value)) {
            if (this.allowedQueryParameters.has(k.toLowerCase())) {
                sanitized[k] = value[k];
            }
            else {
                sanitized[k] = RedactedString;
            }
        }
        return sanitized;
    }
}
//# sourceMappingURL=sanitizer.js.map

/***/ },

/***/ 2179
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computeSha256Hash: () => (/* binding */ computeSha256Hash),
/* harmony export */   computeSha256Hmac: () => (/* binding */ computeSha256Hmac)
/* harmony export */ });
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1583);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Generates a SHA-256 HMAC signature.
 * @param key - The HMAC key represented as a base64 string, used to generate the cryptographic HMAC hash.
 * @param stringToSign - The data to be signed.
 * @param encoding - The textual encoding to use for the returned HMAC digest.
 */
async function computeSha256Hmac(key, stringToSign, encoding) {
    const decodedKey = Buffer.from(key, "base64");
    return (0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.createHmac)("sha256", decodedKey).update(stringToSign).digest(encoding);
}
/**
 * Generates a SHA-256 hash.
 * @param content - The data to be included in the hash.
 * @param encoding - The textual encoding to use for the returned hash.
 */
async function computeSha256Hash(content, encoding) {
    return (0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.createHash)("sha256").update(content).digest(encoding);
}
//# sourceMappingURL=sha256.js.map

/***/ },

/***/ 2147
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBinaryBody: () => (/* binding */ isBinaryBody),
/* harmony export */   isBlob: () => (/* binding */ isBlob),
/* harmony export */   isNodeReadableStream: () => (/* binding */ isNodeReadableStream),
/* harmony export */   isReadableStream: () => (/* binding */ isReadableStream),
/* harmony export */   isWebReadableStream: () => (/* binding */ isWebReadableStream)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
function isNodeReadableStream(x) {
    return Boolean(x && typeof x["pipe"] === "function");
}
function isWebReadableStream(x) {
    return Boolean(x &&
        typeof x.getReader === "function" &&
        typeof x.tee === "function");
}
function isBinaryBody(body) {
    return (body !== undefined &&
        (body instanceof Uint8Array ||
            isReadableStream(body) ||
            typeof body === "function" ||
            body instanceof Blob));
}
function isReadableStream(x) {
    return isNodeReadableStream(x) || isWebReadableStream(x);
}
function isBlob(x) {
    return typeof x.stream === "function";
}
//# sourceMappingURL=typeGuards.js.map

/***/ },

/***/ 2130
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getUserAgentHeaderName: () => (/* binding */ getUserAgentHeaderName),
/* harmony export */   getUserAgentValue: () => (/* binding */ getUserAgentValue)
/* harmony export */ });
/* harmony import */ var _userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2131);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2132);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


function getUserAgentString(telemetryInfo) {
    const parts = [];
    for (const [key, value] of telemetryInfo) {
        const token = value ? `${key}/${value}` : key;
        parts.push(token);
    }
    return parts.join(" ");
}
/**
 * @internal
 */
function getUserAgentHeaderName() {
    return (0,_userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__.getHeaderName)();
}
/**
 * @internal
 */
async function getUserAgentValue(prefix) {
    const runtimeInfo = new Map();
    runtimeInfo.set("ts-http-runtime", _constants_js__WEBPACK_IMPORTED_MODULE_1__.SDK_VERSION);
    await (0,_userAgentPlatform_js__WEBPACK_IMPORTED_MODULE_0__.setPlatformSpecificData)(runtimeInfo);
    const defaultAgent = getUserAgentString(runtimeInfo);
    const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
    return userAgentValue;
}
//# sourceMappingURL=userAgent.js.map

/***/ },

/***/ 2131
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHeaderName: () => (/* binding */ getHeaderName),
/* harmony export */   setPlatformSpecificData: () => (/* binding */ setPlatformSpecificData)
/* harmony export */ });
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1925);
/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1450);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * @internal
 */
function getHeaderName() {
    return "User-Agent";
}
/**
 * @internal
 */
async function setPlatformSpecificData(map) {
    if (node_process__WEBPACK_IMPORTED_MODULE_1__ && node_process__WEBPACK_IMPORTED_MODULE_1__.versions) {
        const osInfo = `${node_os__WEBPACK_IMPORTED_MODULE_0__.type()} ${node_os__WEBPACK_IMPORTED_MODULE_0__.release()}; ${node_os__WEBPACK_IMPORTED_MODULE_0__.arch()}`;
        const versions = node_process__WEBPACK_IMPORTED_MODULE_1__.versions;
        if (versions.bun) {
            map.set("Bun", `${versions.bun} (${osInfo})`);
        }
        else if (versions.deno) {
            map.set("Deno", `${versions.deno} (${osInfo})`);
        }
        else if (versions.node) {
            map.set("Node", `${versions.node} (${osInfo})`);
        }
    }
}
//# sourceMappingURL=userAgentPlatform.js.map

/***/ },

/***/ 2113
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   randomUUID: () => (/* binding */ randomUUID)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Generated Universally Unique Identifier
 *
 * @returns RFC4122 v4 UUID.
 */
function randomUUID() {
    return crypto.randomUUID();
}
//# sourceMappingURL=uuidUtils.js.map

/***/ }

};
;
//# sourceMappingURL=4.extension.js.map