"use strict";
exports.id = 3;
exports.ids = [3];
exports.modules = {

/***/ 2218
(__unused_webpack_module, exports) {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.state = void 0;
/**
 * Holds the singleton operationRequestMap, to be shared across CJS and ESM imports.
 */
exports.state = {
    operationRequestMap: new WeakMap(),
};
//# sourceMappingURL=state-cjs.cjs.map

/***/ },

/***/ 2224
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authorizeRequestOnClaimChallenge: () => (/* binding */ authorizeRequestOnClaimChallenge),
/* harmony export */   parseCAEChallenge: () => (/* binding */ parseCAEChallenge)
/* harmony export */ });
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2223);
/* harmony import */ var _base64_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2098);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


/**
 * Converts: `Bearer a="b", c="d", Bearer d="e", f="g"`.
 * Into: `[ { a: 'b', c: 'd' }, { d: 'e', f: 'g' } ]`.
 *
 * @internal
 */
function parseCAEChallenge(challenges) {
    const bearerChallenges = `, ${challenges.trim()}`.split(", Bearer ").filter((x) => x);
    return bearerChallenges.map((challenge) => {
        const challengeParts = `${challenge.trim()}, `.split('", ').filter((x) => x);
        const keyValuePairs = challengeParts.map((keyValue) => (([key, value]) => ({ [key]: value }))(keyValue.trim().split('="')));
        // Key-value pairs to plain object:
        return keyValuePairs.reduce((a, b) => ({ ...a, ...b }), {});
    });
}
/**
 * This function can be used as a callback for the `bearerTokenAuthenticationPolicy` of `@azure/core-rest-pipeline`, to support CAE challenges:
 * [Continuous Access Evaluation](https://learn.microsoft.com/azure/active-directory/conditional-access/concept-continuous-access-evaluation).
 *
 * Call the `bearerTokenAuthenticationPolicy` with the following options:
 *
 * ```ts snippet:AuthorizeRequestOnClaimChallenge
 * import { bearerTokenAuthenticationPolicy } from "@azure/core-rest-pipeline";
 * import { authorizeRequestOnClaimChallenge } from "@azure/core-client";
 *
 * const policy = bearerTokenAuthenticationPolicy({
 *   challengeCallbacks: {
 *     authorizeRequestOnChallenge: authorizeRequestOnClaimChallenge,
 *   },
 *   scopes: ["https://service/.default"],
 * });
 * ```
 *
 * Once provided, the `bearerTokenAuthenticationPolicy` policy will internally handle Continuous Access Evaluation (CAE) challenges.
 * When it can't complete a challenge it will return the 401 (unauthorized) response from ARM.
 *
 * Example challenge with claims:
 *
 * ```
 * Bearer authorization_uri="https://login.windows-ppe.net/", error="invalid_token",
 * error_description="User session has been revoked",
 * claims="eyJhY2Nlc3NfdG9rZW4iOnsibmJmIjp7ImVzc2VudGlhbCI6dHJ1ZSwgInZhbHVlIjoiMTYwMzc0MjgwMCJ9fX0="
 * ```
 */
async function authorizeRequestOnClaimChallenge(onChallengeOptions) {
    const { scopes, response } = onChallengeOptions;
    const logger = onChallengeOptions.logger || _log_js__WEBPACK_IMPORTED_MODULE_0__.logger;
    const challenge = response.headers.get("WWW-Authenticate");
    if (!challenge) {
        logger.info(`The WWW-Authenticate header was missing. Failed to perform the Continuous Access Evaluation authentication flow.`);
        return false;
    }
    const challenges = parseCAEChallenge(challenge) || [];
    const parsedChallenge = challenges.find((x) => x.claims);
    if (!parsedChallenge) {
        logger.info(`The WWW-Authenticate header was missing the necessary "claims" to perform the Continuous Access Evaluation authentication flow.`);
        return false;
    }
    const accessToken = await onChallengeOptions.getAccessToken(parsedChallenge.scope ? [parsedChallenge.scope] : scopes, {
        claims: (0,_base64_js__WEBPACK_IMPORTED_MODULE_1__.decodeStringToString)(parsedChallenge.claims),
    });
    if (!accessToken) {
        return false;
    }
    onChallengeOptions.request.headers.set("Authorization", `${accessToken.tokenType ?? "Bearer"} ${accessToken.token}`);
    return true;
}
//# sourceMappingURL=authorizeRequestOnClaimChallenge.js.map

/***/ },

/***/ 2225
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authorizeRequestOnTenantChallenge: () => (/* binding */ authorizeRequestOnTenantChallenge)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * A set of constants used internally when processing requests.
 */
const Constants = {
    DefaultScope: "/.default",
    /**
     * Defines constants for use with HTTP headers.
     */
    HeaderConstants: {
        /**
         * The Authorization header.
         */
        AUTHORIZATION: "authorization",
    },
};
function isUuid(text) {
    return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(text);
}
/**
 * Defines a callback to handle auth challenge for Storage APIs.
 * This implements the bearer challenge process described here: https://learn.microsoft.com/rest/api/storageservices/authorize-with-azure-active-directory#bearer-challenge
 * Handling has specific features for storage that departs to the general AAD challenge docs.
 **/
const authorizeRequestOnTenantChallenge = async (challengeOptions) => {
    const requestOptions = requestToOptions(challengeOptions.request);
    const challenge = getChallenge(challengeOptions.response);
    if (challenge) {
        const challengeInfo = parseChallenge(challenge);
        const challengeScopes = buildScopes(challengeOptions, challengeInfo);
        const tenantId = extractTenantId(challengeInfo);
        if (!tenantId) {
            return false;
        }
        const accessToken = await challengeOptions.getAccessToken(challengeScopes, {
            ...requestOptions,
            tenantId,
        });
        if (!accessToken) {
            return false;
        }
        challengeOptions.request.headers.set(Constants.HeaderConstants.AUTHORIZATION, `${accessToken.tokenType ?? "Bearer"} ${accessToken.token}`);
        return true;
    }
    return false;
};
/**
 * Extracts the tenant id from the challenge information
 * The tenant id is contained in the authorization_uri as the first
 * path part.
 */
function extractTenantId(challengeInfo) {
    const parsedAuthUri = new URL(challengeInfo.authorization_uri);
    const pathSegments = parsedAuthUri.pathname.split("/");
    const tenantId = pathSegments[1];
    if (tenantId && isUuid(tenantId)) {
        return tenantId;
    }
    return undefined;
}
/**
 * Builds the authentication scopes based on the information that comes in the
 * challenge information. Scopes url is present in the resource_id, if it is empty
 * we keep using the original scopes.
 */
function buildScopes(challengeOptions, challengeInfo) {
    if (!challengeInfo.resource_id) {
        return challengeOptions.scopes;
    }
    const challengeScopes = new URL(challengeInfo.resource_id);
    challengeScopes.pathname = Constants.DefaultScope;
    let scope = challengeScopes.toString();
    if (scope === "https://disk.azure.com/.default") {
        // the extra slash is required by the service
        scope = "https://disk.azure.com//.default";
    }
    return [scope];
}
/**
 * We will retrieve the challenge only if the response status code was 401,
 * and if the response contained the header "WWW-Authenticate" with a non-empty value.
 */
function getChallenge(response) {
    const challenge = response.headers.get("WWW-Authenticate");
    if (response.status === 401 && challenge) {
        return challenge;
    }
    return;
}
/**
 * Converts: `Bearer a="b" c="d"`.
 * Into: `[ { a: 'b', c: 'd' }]`.
 *
 * @internal
 */
function parseChallenge(challenge) {
    const bearerChallenge = challenge.slice("Bearer ".length);
    const challengeParts = `${bearerChallenge.trim()} `.split(" ").filter((x) => x);
    const keyValuePairs = challengeParts.map((keyValue) => (([key, value]) => ({ [key]: value }))(keyValue.trim().split("=")));
    // Key-value pairs to plain object:
    return keyValuePairs.reduce((a, b) => ({ ...a, ...b }), {});
}
/**
 * Extracts the options form a Pipeline Request for later re-use
 */
function requestToOptions(request) {
    return {
        abortSignal: request.abortSignal,
        requestOptions: {
            timeout: request.timeout,
        },
        tracingOptions: request.tracingOptions,
    };
}
//# sourceMappingURL=authorizeRequestOnTenantChallenge.js.map

/***/ },

/***/ 2098
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decodeString: () => (/* binding */ decodeString),
/* harmony export */   decodeStringToString: () => (/* binding */ decodeStringToString),
/* harmony export */   encodeByteArray: () => (/* binding */ encodeByteArray),
/* harmony export */   encodeString: () => (/* binding */ encodeString)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Encodes a string in base64 format.
 * @param value - the string to encode
 * @internal
 */
function encodeString(value) {
    return Buffer.from(value).toString("base64");
}
/**
 * Encodes a byte array in base64 format.
 * @param value - the Uint8Aray to encode
 * @internal
 */
function encodeByteArray(value) {
    const bufferValue = value instanceof Buffer ? value : Buffer.from(value.buffer);
    return bufferValue.toString("base64");
}
/**
 * Decodes a base64 string into a byte array.
 * @param value - the base64 string to decode
 * @internal
 */
function decodeString(value) {
    return Buffer.from(value, "base64");
}
/**
 * Decodes a base64 string into a string.
 * @param value - the base64 string to decode
 * @internal
 */
function decodeStringToString(value) {
    return Buffer.from(value, "base64").toString();
}
//# sourceMappingURL=base64.js.map

/***/ },

/***/ 2215
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deserializationPolicy: () => (/* binding */ deserializationPolicy),
/* harmony export */   deserializationPolicyName: () => (/* binding */ deserializationPolicyName)
/* harmony export */ });
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2099);
/* harmony import */ var _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2102);
/* harmony import */ var _serializer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2097);
/* harmony import */ var _operationHelpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2216);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.




const defaultJsonContentTypes = ["application/json", "text/json"];
const defaultXmlContentTypes = ["application/xml", "application/atom+xml"];
/**
 * The programmatic identifier of the deserializationPolicy.
 */
const deserializationPolicyName = "deserializationPolicy";
/**
 * This policy handles parsing out responses according to OperationSpecs on the request.
 */
function deserializationPolicy(options = {}) {
    const jsonContentTypes = options.expectedContentTypes?.json ?? defaultJsonContentTypes;
    const xmlContentTypes = options.expectedContentTypes?.xml ?? defaultXmlContentTypes;
    const parseXML = options.parseXML;
    const serializerOptions = options.serializerOptions;
    const updatedOptions = {
        xml: {
            rootName: serializerOptions?.xml.rootName ?? "",
            includeRoot: serializerOptions?.xml.includeRoot ?? false,
            xmlCharKey: serializerOptions?.xml.xmlCharKey ?? _interfaces_js__WEBPACK_IMPORTED_MODULE_0__.XML_CHARKEY,
        },
    };
    return {
        name: deserializationPolicyName,
        async sendRequest(request, next) {
            const response = await next(request);
            return deserializeResponseBody(jsonContentTypes, xmlContentTypes, response, updatedOptions, parseXML);
        },
    };
}
function getOperationResponseMap(parsedResponse) {
    let result;
    const request = parsedResponse.request;
    const operationInfo = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getOperationRequestInfo)(request);
    const operationSpec = operationInfo?.operationSpec;
    if (operationSpec) {
        if (!operationInfo?.operationResponseGetter) {
            result = operationSpec.responses[parsedResponse.status];
        }
        else {
            result = operationInfo?.operationResponseGetter(operationSpec, parsedResponse);
        }
    }
    return result;
}
function shouldDeserializeResponse(parsedResponse) {
    const request = parsedResponse.request;
    const operationInfo = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getOperationRequestInfo)(request);
    const shouldDeserialize = operationInfo?.shouldDeserialize;
    let result;
    if (shouldDeserialize === undefined) {
        result = true;
    }
    else if (typeof shouldDeserialize === "boolean") {
        result = shouldDeserialize;
    }
    else {
        result = shouldDeserialize(parsedResponse);
    }
    return result;
}
async function deserializeResponseBody(jsonContentTypes, xmlContentTypes, response, options, parseXML) {
    const parsedResponse = await parse(jsonContentTypes, xmlContentTypes, response, options, parseXML);
    if (!shouldDeserializeResponse(parsedResponse)) {
        return parsedResponse;
    }
    const operationInfo = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getOperationRequestInfo)(parsedResponse.request);
    const operationSpec = operationInfo?.operationSpec;
    if (!operationSpec || !operationSpec.responses) {
        return parsedResponse;
    }
    const responseSpec = getOperationResponseMap(parsedResponse);
    const { error, shouldReturnResponse } = handleErrorResponse(parsedResponse, operationSpec, responseSpec, options);
    if (error) {
        throw error;
    }
    else if (shouldReturnResponse) {
        return parsedResponse;
    }
    // An operation response spec does exist for current status code, so
    // use it to deserialize the response.
    if (responseSpec) {
        if (responseSpec.bodyMapper) {
            let valueToDeserialize = parsedResponse.parsedBody;
            if (operationSpec.isXML && responseSpec.bodyMapper.type.name === _serializer_js__WEBPACK_IMPORTED_MODULE_2__.MapperTypeNames.Sequence) {
                valueToDeserialize =
                    typeof valueToDeserialize === "object"
                        ? valueToDeserialize[responseSpec.bodyMapper.xmlElementName]
                        : [];
            }
            try {
                parsedResponse.parsedBody = operationSpec.serializer.deserialize(responseSpec.bodyMapper, valueToDeserialize, "operationRes.parsedBody", options);
            }
            catch (deserializeError) {
                const restError = new _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__.RestError(`Error ${deserializeError} occurred in deserializing the responseBody - ${parsedResponse.bodyAsText}`, {
                    statusCode: parsedResponse.status,
                    request: parsedResponse.request,
                    response: parsedResponse,
                });
                throw restError;
            }
        }
        else if (operationSpec.httpMethod === "HEAD") {
            // head methods never have a body, but we return a boolean to indicate presence/absence of the resource
            parsedResponse.parsedBody = response.status >= 200 && response.status < 300;
        }
        if (responseSpec.headersMapper) {
            parsedResponse.parsedHeaders = operationSpec.serializer.deserialize(responseSpec.headersMapper, parsedResponse.headers.toJSON(), "operationRes.parsedHeaders", { xml: {}, ignoreUnknownProperties: true });
        }
    }
    return parsedResponse;
}
function isOperationSpecEmpty(operationSpec) {
    const expectedStatusCodes = Object.keys(operationSpec.responses);
    return (expectedStatusCodes.length === 0 ||
        (expectedStatusCodes.length === 1 && expectedStatusCodes[0] === "default"));
}
function handleErrorResponse(parsedResponse, operationSpec, responseSpec, options) {
    const isSuccessByStatus = 200 <= parsedResponse.status && parsedResponse.status < 300;
    const isExpectedStatusCode = isOperationSpecEmpty(operationSpec)
        ? isSuccessByStatus
        : !!responseSpec;
    if (isExpectedStatusCode) {
        if (responseSpec) {
            if (!responseSpec.isError) {
                return { error: null, shouldReturnResponse: false };
            }
        }
        else {
            return { error: null, shouldReturnResponse: false };
        }
    }
    const errorResponseSpec = responseSpec ?? operationSpec.responses.default;
    const initialErrorMessage = parsedResponse.request.streamResponseStatusCodes?.has(parsedResponse.status)
        ? `Unexpected status code: ${parsedResponse.status}`
        : parsedResponse.bodyAsText;
    const error = new _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__.RestError(initialErrorMessage, {
        statusCode: parsedResponse.status,
        request: parsedResponse.request,
        response: parsedResponse,
    });
    // If the item failed but there's no error spec or default spec to deserialize the error,
    // and the parsed body doesn't look like an error object,
    // we should fail so we just throw the parsed response
    if (!errorResponseSpec &&
        !(parsedResponse.parsedBody?.error?.code && parsedResponse.parsedBody?.error?.message)) {
        throw error;
    }
    const defaultBodyMapper = errorResponseSpec?.bodyMapper;
    const defaultHeadersMapper = errorResponseSpec?.headersMapper;
    try {
        // If error response has a body, try to deserialize it using default body mapper.
        // Then try to extract error code & message from it
        if (parsedResponse.parsedBody) {
            const parsedBody = parsedResponse.parsedBody;
            let deserializedError;
            if (defaultBodyMapper) {
                let valueToDeserialize = parsedBody;
                if (operationSpec.isXML && defaultBodyMapper.type.name === _serializer_js__WEBPACK_IMPORTED_MODULE_2__.MapperTypeNames.Sequence) {
                    valueToDeserialize = [];
                    const elementName = defaultBodyMapper.xmlElementName;
                    if (typeof parsedBody === "object" && elementName) {
                        valueToDeserialize = parsedBody[elementName];
                    }
                }
                deserializedError = operationSpec.serializer.deserialize(defaultBodyMapper, valueToDeserialize, "error.response.parsedBody", options);
            }
            const internalError = parsedBody.error || deserializedError || parsedBody;
            error.code = internalError.code;
            if (internalError.message) {
                error.message = internalError.message;
            }
            if (defaultBodyMapper) {
                error.response.parsedBody = deserializedError;
            }
        }
        // If error response has headers, try to deserialize it using default header mapper
        if (parsedResponse.headers && defaultHeadersMapper) {
            error.response.parsedHeaders =
                operationSpec.serializer.deserialize(defaultHeadersMapper, parsedResponse.headers.toJSON(), "operationRes.parsedHeaders");
        }
    }
    catch (defaultError) {
        error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody - "${parsedResponse.bodyAsText}" for the default response.`;
    }
    return { error, shouldReturnResponse: false };
}
async function parse(jsonContentTypes, xmlContentTypes, operationResponse, opts, parseXML) {
    if (!operationResponse.request.streamResponseStatusCodes?.has(operationResponse.status) &&
        operationResponse.bodyAsText) {
        const text = operationResponse.bodyAsText;
        const contentType = operationResponse.headers.get("Content-Type") || "";
        const contentComponents = !contentType
            ? []
            : contentType.split(";").map((component) => component.toLowerCase());
        try {
            if (contentComponents.length === 0 ||
                contentComponents.some((component) => jsonContentTypes.indexOf(component) !== -1)) {
                operationResponse.parsedBody = JSON.parse(text);
                return operationResponse;
            }
            else if (contentComponents.some((component) => xmlContentTypes.indexOf(component) !== -1)) {
                if (!parseXML) {
                    throw new Error("Parsing XML not supported.");
                }
                const body = await parseXML(text, opts.xml);
                operationResponse.parsedBody = body;
                return operationResponse;
            }
        }
        catch (err) {
            const msg = `Error "${err}" occurred while parsing the response body - ${operationResponse.bodyAsText}.`;
            const errCode = err.code || _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__.RestError.PARSE_ERROR;
            const e = new _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__.RestError(msg, {
                code: errCode,
                statusCode: operationResponse.status,
                request: operationResponse.request,
                response: operationResponse,
            });
            throw e;
        }
    }
    return operationResponse;
}
//# sourceMappingURL=deserializationPolicy.js.map

/***/ },

/***/ 2221
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCachedDefaultHttpClient: () => (/* binding */ getCachedDefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2102);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

let cachedHttpClient;
function getCachedDefaultHttpClient() {
    if (!cachedHttpClient) {
        cachedHttpClient = (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.createDefaultHttpClient)();
    }
    return cachedHttpClient;
}
//# sourceMappingURL=httpClientCache.js.map

/***/ },

/***/ 2096
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MapperTypeNames: () => (/* reexport safe */ _serializer_js__WEBPACK_IMPORTED_MODULE_0__.MapperTypeNames),
/* harmony export */   ServiceClient: () => (/* reexport safe */ _serviceClient_js__WEBPACK_IMPORTED_MODULE_1__.ServiceClient),
/* harmony export */   XML_ATTRKEY: () => (/* reexport safe */ _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.XML_ATTRKEY),
/* harmony export */   XML_CHARKEY: () => (/* reexport safe */ _interfaces_js__WEBPACK_IMPORTED_MODULE_3__.XML_CHARKEY),
/* harmony export */   authorizeRequestOnClaimChallenge: () => (/* reexport safe */ _authorizeRequestOnClaimChallenge_js__WEBPACK_IMPORTED_MODULE_6__.authorizeRequestOnClaimChallenge),
/* harmony export */   authorizeRequestOnTenantChallenge: () => (/* reexport safe */ _authorizeRequestOnTenantChallenge_js__WEBPACK_IMPORTED_MODULE_7__.authorizeRequestOnTenantChallenge),
/* harmony export */   createClientPipeline: () => (/* reexport safe */ _pipeline_js__WEBPACK_IMPORTED_MODULE_2__.createClientPipeline),
/* harmony export */   createSerializer: () => (/* reexport safe */ _serializer_js__WEBPACK_IMPORTED_MODULE_0__.createSerializer),
/* harmony export */   deserializationPolicy: () => (/* reexport safe */ _deserializationPolicy_js__WEBPACK_IMPORTED_MODULE_4__.deserializationPolicy),
/* harmony export */   deserializationPolicyName: () => (/* reexport safe */ _deserializationPolicy_js__WEBPACK_IMPORTED_MODULE_4__.deserializationPolicyName),
/* harmony export */   serializationPolicy: () => (/* reexport safe */ _serializationPolicy_js__WEBPACK_IMPORTED_MODULE_5__.serializationPolicy),
/* harmony export */   serializationPolicyName: () => (/* reexport safe */ _serializationPolicy_js__WEBPACK_IMPORTED_MODULE_5__.serializationPolicyName)
/* harmony export */ });
/* harmony import */ var _serializer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2097);
/* harmony import */ var _serviceClient_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2101);
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2214);
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2099);
/* harmony import */ var _deserializationPolicy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2215);
/* harmony import */ var _serializationPolicy_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2219);
/* harmony import */ var _authorizeRequestOnClaimChallenge_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2224);
/* harmony import */ var _authorizeRequestOnTenantChallenge_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2225);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.








//# sourceMappingURL=index.js.map

/***/ },

/***/ 2220
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPathStringFromParameter: () => (/* binding */ getPathStringFromParameter),
/* harmony export */   getStreamingResponseStatusCodes: () => (/* binding */ getStreamingResponseStatusCodes)
/* harmony export */ });
/* harmony import */ var _serializer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2097);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Gets the list of status codes for streaming responses.
 * @internal
 */
function getStreamingResponseStatusCodes(operationSpec) {
    const result = new Set();
    for (const statusCode in operationSpec.responses) {
        const operationResponse = operationSpec.responses[statusCode];
        if (operationResponse.bodyMapper &&
            operationResponse.bodyMapper.type.name === _serializer_js__WEBPACK_IMPORTED_MODULE_0__.MapperTypeNames.Stream) {
            result.add(Number(statusCode));
        }
    }
    return result;
}
/**
 * Get the path to this parameter's value as a dotted string (a.b.c).
 * @param parameter - The parameter to get the path string for.
 * @returns The path to this parameter's value as a dotted string.
 * @internal
 */
function getPathStringFromParameter(parameter) {
    const { parameterPath, mapper } = parameter;
    let result;
    if (typeof parameterPath === "string") {
        result = parameterPath;
    }
    else if (Array.isArray(parameterPath)) {
        result = parameterPath.join(".");
    }
    else {
        result = mapper.serializedName;
    }
    return result;
}
//# sourceMappingURL=interfaceHelpers.js.map

/***/ },

/***/ 2099
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XML_ATTRKEY: () => (/* binding */ XML_ATTRKEY),
/* harmony export */   XML_CHARKEY: () => (/* binding */ XML_CHARKEY)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Default key used to access the XML attributes.
 */
const XML_ATTRKEY = "$";
/**
 * Default key used to access the XML value content.
 */
const XML_CHARKEY = "_";
//# sourceMappingURL=interfaces.js.map

/***/ },

/***/ 2223
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logger: () => (/* binding */ logger)
/* harmony export */ });
/* harmony import */ var _azure_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2164);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const logger = (0,_azure_logger__WEBPACK_IMPORTED_MODULE_0__.createClientLogger)("core-client");
//# sourceMappingURL=log.js.map

/***/ },

/***/ 2216
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getOperationArgumentValueFromParameter: () => (/* binding */ getOperationArgumentValueFromParameter),
/* harmony export */   getOperationRequestInfo: () => (/* binding */ getOperationRequestInfo)
/* harmony export */ });
/* harmony import */ var _state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2217);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @internal
 * Retrieves the value to use for a given operation argument
 * @param operationArguments - The arguments passed from the generated client
 * @param parameter - The parameter description
 * @param fallbackObject - If something isn't found in the arguments bag, look here.
 *  Generally used to look at the service client properties.
 */
function getOperationArgumentValueFromParameter(operationArguments, parameter, fallbackObject) {
    let parameterPath = parameter.parameterPath;
    const parameterMapper = parameter.mapper;
    let value;
    if (typeof parameterPath === "string") {
        parameterPath = [parameterPath];
    }
    if (Array.isArray(parameterPath)) {
        if (parameterPath.length > 0) {
            if (parameterMapper.isConstant) {
                value = parameterMapper.defaultValue;
            }
            else {
                let propertySearchResult = getPropertyFromParameterPath(operationArguments, parameterPath);
                if (!propertySearchResult.propertyFound && fallbackObject) {
                    propertySearchResult = getPropertyFromParameterPath(fallbackObject, parameterPath);
                }
                let useDefaultValue = false;
                if (!propertySearchResult.propertyFound) {
                    useDefaultValue =
                        parameterMapper.required ||
                            (parameterPath[0] === "options" && parameterPath.length === 2);
                }
                value = useDefaultValue ? parameterMapper.defaultValue : propertySearchResult.propertyValue;
            }
        }
    }
    else {
        if (parameterMapper.required) {
            value = {};
        }
        for (const propertyName in parameterPath) {
            const propertyMapper = parameterMapper.type.modelProperties[propertyName];
            const propertyPath = parameterPath[propertyName];
            const propertyValue = getOperationArgumentValueFromParameter(operationArguments, {
                parameterPath: propertyPath,
                mapper: propertyMapper,
            }, fallbackObject);
            if (propertyValue !== undefined) {
                if (!value) {
                    value = {};
                }
                value[propertyName] = propertyValue;
            }
        }
    }
    return value;
}
function getPropertyFromParameterPath(parent, parameterPath) {
    const result = { propertyFound: false };
    let i = 0;
    for (; i < parameterPath.length; ++i) {
        const parameterPathPart = parameterPath[i];
        // Make sure to check inherited properties too, so don't use hasOwnProperty().
        if (parent && parameterPathPart in parent) {
            parent = parent[parameterPathPart];
        }
        else {
            break;
        }
    }
    if (i === parameterPath.length) {
        result.propertyValue = parent;
        result.propertyFound = true;
    }
    return result;
}
const originalRequestSymbol = Symbol.for("@azure/core-client original request");
function hasOriginalRequest(request) {
    return originalRequestSymbol in request;
}
function getOperationRequestInfo(request) {
    if (hasOriginalRequest(request)) {
        return getOperationRequestInfo(request[originalRequestSymbol]);
    }
    let info = _state_js__WEBPACK_IMPORTED_MODULE_0__.state.operationRequestMap.get(request);
    if (!info) {
        info = {};
        _state_js__WEBPACK_IMPORTED_MODULE_0__.state.operationRequestMap.set(request, info);
    }
    return info;
}
//# sourceMappingURL=operationHelpers.js.map

/***/ },

/***/ 2214
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createClientPipeline: () => (/* binding */ createClientPipeline)
/* harmony export */ });
/* harmony import */ var _deserializationPolicy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2215);
/* harmony import */ var _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2102);
/* harmony import */ var _serializationPolicy_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2219);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



/**
 * Creates a new Pipeline for use with a Service Client.
 * Adds in deserializationPolicy by default.
 * Also adds in bearerTokenAuthenticationPolicy if passed a TokenCredential.
 * @param options - Options to customize the created pipeline.
 */
function createClientPipeline(options = {}) {
    const pipeline = (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__.createPipelineFromOptions)(options ?? {});
    if (options.credentialOptions) {
        pipeline.addPolicy((0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_1__.bearerTokenAuthenticationPolicy)({
            credential: options.credentialOptions.credential,
            scopes: options.credentialOptions.credentialScopes,
        }));
    }
    pipeline.addPolicy((0,_serializationPolicy_js__WEBPACK_IMPORTED_MODULE_2__.serializationPolicy)(options.serializationOptions), { phase: "Serialize" });
    pipeline.addPolicy((0,_deserializationPolicy_js__WEBPACK_IMPORTED_MODULE_0__.deserializationPolicy)(options.deserializationOptions), {
        phase: "Deserialize",
    });
    return pipeline;
}
//# sourceMappingURL=pipeline.js.map

/***/ },

/***/ 2219
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serializationPolicy: () => (/* binding */ serializationPolicy),
/* harmony export */   serializationPolicyName: () => (/* binding */ serializationPolicyName),
/* harmony export */   serializeHeaders: () => (/* binding */ serializeHeaders),
/* harmony export */   serializeRequestBody: () => (/* binding */ serializeRequestBody)
/* harmony export */ });
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2099);
/* harmony import */ var _operationHelpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2216);
/* harmony import */ var _serializer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2097);
/* harmony import */ var _interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2220);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.




/**
 * The programmatic identifier of the serializationPolicy.
 */
const serializationPolicyName = "serializationPolicy";
/**
 * This policy handles assembling the request body and headers using
 * an OperationSpec and OperationArguments on the request.
 */
function serializationPolicy(options = {}) {
    const stringifyXML = options.stringifyXML;
    return {
        name: serializationPolicyName,
        async sendRequest(request, next) {
            const operationInfo = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_1__.getOperationRequestInfo)(request);
            const operationSpec = operationInfo?.operationSpec;
            const operationArguments = operationInfo?.operationArguments;
            if (operationSpec && operationArguments) {
                serializeHeaders(request, operationArguments, operationSpec);
                serializeRequestBody(request, operationArguments, operationSpec, stringifyXML);
            }
            return next(request);
        },
    };
}
/**
 * @internal
 */
function serializeHeaders(request, operationArguments, operationSpec) {
    if (operationSpec.headerParameters) {
        for (const headerParameter of operationSpec.headerParameters) {
            let headerValue = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_1__.getOperationArgumentValueFromParameter)(operationArguments, headerParameter);
            if ((headerValue !== null && headerValue !== undefined) || headerParameter.mapper.required) {
                headerValue = operationSpec.serializer.serialize(headerParameter.mapper, headerValue, (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getPathStringFromParameter)(headerParameter));
                const headerCollectionPrefix = headerParameter.mapper
                    .headerCollectionPrefix;
                if (headerCollectionPrefix) {
                    for (const key of Object.keys(headerValue)) {
                        request.headers.set(headerCollectionPrefix + key, headerValue[key]);
                    }
                }
                else {
                    request.headers.set(headerParameter.mapper.serializedName || (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getPathStringFromParameter)(headerParameter), headerValue);
                }
            }
        }
    }
    const customHeaders = operationArguments.options?.requestOptions?.customHeaders;
    if (customHeaders) {
        for (const customHeaderName of Object.keys(customHeaders)) {
            request.headers.set(customHeaderName, customHeaders[customHeaderName]);
        }
    }
}
/**
 * @internal
 */
function serializeRequestBody(request, operationArguments, operationSpec, stringifyXML = function () {
    throw new Error("XML serialization unsupported!");
}) {
    const serializerOptions = operationArguments.options?.serializerOptions;
    const updatedOptions = {
        xml: {
            rootName: serializerOptions?.xml.rootName ?? "",
            includeRoot: serializerOptions?.xml.includeRoot ?? false,
            xmlCharKey: serializerOptions?.xml.xmlCharKey ?? _interfaces_js__WEBPACK_IMPORTED_MODULE_0__.XML_CHARKEY,
        },
    };
    const xmlCharKey = updatedOptions.xml.xmlCharKey;
    if (operationSpec.requestBody && operationSpec.requestBody.mapper) {
        request.body = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_1__.getOperationArgumentValueFromParameter)(operationArguments, operationSpec.requestBody);
        const bodyMapper = operationSpec.requestBody.mapper;
        const { required, serializedName, xmlName, xmlElementName, xmlNamespace, xmlNamespacePrefix, nullable, } = bodyMapper;
        const typeName = bodyMapper.type.name;
        try {
            if ((request.body !== undefined && request.body !== null) ||
                (nullable && request.body === null) ||
                required) {
                const requestBodyParameterPathString = (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getPathStringFromParameter)(operationSpec.requestBody);
                request.body = operationSpec.serializer.serialize(bodyMapper, request.body, requestBodyParameterPathString, updatedOptions);
                const isStream = typeName === _serializer_js__WEBPACK_IMPORTED_MODULE_2__.MapperTypeNames.Stream;
                if (operationSpec.isXML) {
                    const xmlnsKey = xmlNamespacePrefix ? `xmlns:${xmlNamespacePrefix}` : "xmlns";
                    const value = getXmlValueWithNamespace(xmlNamespace, xmlnsKey, typeName, request.body, updatedOptions);
                    if (typeName === _serializer_js__WEBPACK_IMPORTED_MODULE_2__.MapperTypeNames.Sequence) {
                        request.body = stringifyXML(prepareXMLRootList(value, xmlElementName || xmlName || serializedName, xmlnsKey, xmlNamespace), { rootName: xmlName || serializedName, xmlCharKey });
                    }
                    else if (!isStream) {
                        request.body = stringifyXML(value, {
                            rootName: xmlName || serializedName,
                            xmlCharKey,
                        });
                    }
                }
                else if (typeName === _serializer_js__WEBPACK_IMPORTED_MODULE_2__.MapperTypeNames.String &&
                    (operationSpec.contentType?.match("text/plain") || operationSpec.mediaType === "text")) {
                    // the String serializer has validated that request body is a string
                    // so just send the string.
                    return;
                }
                else if (!isStream) {
                    request.body = JSON.stringify(request.body);
                }
            }
        }
        catch (error) {
            throw new Error(`Error "${error.message}" occurred in serializing the payload - ${JSON.stringify(serializedName, undefined, "  ")}.`);
        }
    }
    else if (operationSpec.formDataParameters && operationSpec.formDataParameters.length > 0) {
        request.formData = {};
        for (const formDataParameter of operationSpec.formDataParameters) {
            const formDataParameterValue = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_1__.getOperationArgumentValueFromParameter)(operationArguments, formDataParameter);
            if (formDataParameterValue !== undefined && formDataParameterValue !== null) {
                const formDataParameterPropertyName = formDataParameter.mapper.serializedName || (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getPathStringFromParameter)(formDataParameter);
                request.formData[formDataParameterPropertyName] = operationSpec.serializer.serialize(formDataParameter.mapper, formDataParameterValue, (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_3__.getPathStringFromParameter)(formDataParameter), updatedOptions);
            }
        }
    }
}
/**
 * Adds an xml namespace to the xml serialized object if needed, otherwise it just returns the value itself
 */
function getXmlValueWithNamespace(xmlNamespace, xmlnsKey, typeName, serializedValue, options) {
    // Composite and Sequence schemas already got their root namespace set during serialization
    // We just need to add xmlns to the other schema types
    if (xmlNamespace && !["Composite", "Sequence", "Dictionary"].includes(typeName)) {
        const result = {};
        result[options.xml.xmlCharKey] = serializedValue;
        result[_interfaces_js__WEBPACK_IMPORTED_MODULE_0__.XML_ATTRKEY] = { [xmlnsKey]: xmlNamespace };
        return result;
    }
    return serializedValue;
}
function prepareXMLRootList(obj, elementName, xmlNamespaceKey, xmlNamespace) {
    if (!Array.isArray(obj)) {
        obj = [obj];
    }
    if (!xmlNamespaceKey || !xmlNamespace) {
        return { [elementName]: obj };
    }
    const result = { [elementName]: obj };
    result[_interfaces_js__WEBPACK_IMPORTED_MODULE_0__.XML_ATTRKEY] = { [xmlNamespaceKey]: xmlNamespace };
    return result;
}
//# sourceMappingURL=serializationPolicy.js.map

/***/ },

/***/ 2097
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MapperTypeNames: () => (/* binding */ MapperTypeNames),
/* harmony export */   createSerializer: () => (/* binding */ createSerializer)
/* harmony export */ });
/* harmony import */ var _base64_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2098);
/* harmony import */ var _interfaces_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2099);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2100);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.



class SerializerImpl {
    modelMappers;
    isXML;
    constructor(modelMappers = {}, isXML = false) {
        this.modelMappers = modelMappers;
        this.isXML = isXML;
    }
    /**
     * @deprecated Removing the constraints validation on client side.
     */
    validateConstraints(mapper, value, objectName) {
        const failValidation = (constraintName, constraintValue) => {
            throw new Error(`"${objectName}" with value "${value}" should satisfy the constraint "${constraintName}": ${constraintValue}.`);
        };
        if (mapper.constraints && value !== undefined && value !== null) {
            const { ExclusiveMaximum, ExclusiveMinimum, InclusiveMaximum, InclusiveMinimum, MaxItems, MaxLength, MinItems, MinLength, MultipleOf, Pattern, UniqueItems, } = mapper.constraints;
            if (ExclusiveMaximum !== undefined && value >= ExclusiveMaximum) {
                failValidation("ExclusiveMaximum", ExclusiveMaximum);
            }
            if (ExclusiveMinimum !== undefined && value <= ExclusiveMinimum) {
                failValidation("ExclusiveMinimum", ExclusiveMinimum);
            }
            if (InclusiveMaximum !== undefined && value > InclusiveMaximum) {
                failValidation("InclusiveMaximum", InclusiveMaximum);
            }
            if (InclusiveMinimum !== undefined && value < InclusiveMinimum) {
                failValidation("InclusiveMinimum", InclusiveMinimum);
            }
            if (MaxItems !== undefined && value.length > MaxItems) {
                failValidation("MaxItems", MaxItems);
            }
            if (MaxLength !== undefined && value.length > MaxLength) {
                failValidation("MaxLength", MaxLength);
            }
            if (MinItems !== undefined && value.length < MinItems) {
                failValidation("MinItems", MinItems);
            }
            if (MinLength !== undefined && value.length < MinLength) {
                failValidation("MinLength", MinLength);
            }
            if (MultipleOf !== undefined && value % MultipleOf !== 0) {
                failValidation("MultipleOf", MultipleOf);
            }
            if (Pattern) {
                const pattern = typeof Pattern === "string" ? new RegExp(Pattern) : Pattern;
                if (typeof value !== "string" || value.match(pattern) === null) {
                    failValidation("Pattern", Pattern);
                }
            }
            if (UniqueItems &&
                value.some((item, i, ar) => ar.indexOf(item) !== i)) {
                failValidation("UniqueItems", UniqueItems);
            }
        }
    }
    /**
     * Serialize the given object based on its metadata defined in the mapper
     *
     * @param mapper - The mapper which defines the metadata of the serializable object
     *
     * @param object - A valid Javascript object to be serialized
     *
     * @param objectName - Name of the serialized object
     *
     * @param options - additional options to serialization
     *
     * @returns A valid serialized Javascript object
     */
    serialize(mapper, object, objectName, options = { xml: {} }) {
        const updatedOptions = {
            xml: {
                rootName: options.xml.rootName ?? "",
                includeRoot: options.xml.includeRoot ?? false,
                xmlCharKey: options.xml.xmlCharKey ?? _interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_CHARKEY,
            },
        };
        let payload = {};
        const mapperType = mapper.type.name;
        if (!objectName) {
            objectName = mapper.serializedName;
        }
        if (mapperType.match(/^Sequence$/i) !== null) {
            payload = [];
        }
        if (mapper.isConstant) {
            object = mapper.defaultValue;
        }
        // This table of allowed values should help explain
        // the mapper.required and mapper.nullable properties.
        // X means "neither undefined or null are allowed".
        //           || required
        //           || true      | false
        //  nullable || ==========================
        //      true || null      | undefined/null
        //     false || X         | undefined
        // undefined || X         | undefined/null
        const { required, nullable } = mapper;
        if (required && nullable && object === undefined) {
            throw new Error(`${objectName} cannot be undefined.`);
        }
        if (required && !nullable && (object === undefined || object === null)) {
            throw new Error(`${objectName} cannot be null or undefined.`);
        }
        if (!required && nullable === false && object === null) {
            throw new Error(`${objectName} cannot be null.`);
        }
        if (object === undefined || object === null) {
            payload = object;
        }
        else {
            if (mapperType.match(/^any$/i) !== null) {
                payload = object;
            }
            else if (mapperType.match(/^(Number|String|Boolean|Object|Stream|Uuid)$/i) !== null) {
                payload = serializeBasicTypes(mapperType, objectName, object);
            }
            else if (mapperType.match(/^Enum$/i) !== null) {
                const enumMapper = mapper;
                payload = serializeEnumType(objectName, enumMapper.type.allowedValues, object);
            }
            else if (mapperType.match(/^(Date|DateTime|TimeSpan|DateTimeRfc1123|UnixTime)$/i) !== null) {
                payload = serializeDateTypes(mapperType, object, objectName);
            }
            else if (mapperType.match(/^ByteArray$/i) !== null) {
                payload = serializeByteArrayType(objectName, object);
            }
            else if (mapperType.match(/^Base64Url$/i) !== null) {
                payload = serializeBase64UrlType(objectName, object);
            }
            else if (mapperType.match(/^Sequence$/i) !== null) {
                payload = serializeSequenceType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
            }
            else if (mapperType.match(/^Dictionary$/i) !== null) {
                payload = serializeDictionaryType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
            }
            else if (mapperType.match(/^Composite$/i) !== null) {
                payload = serializeCompositeType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
            }
        }
        return payload;
    }
    /**
     * Deserialize the given object based on its metadata defined in the mapper
     *
     * @param mapper - The mapper which defines the metadata of the serializable object
     *
     * @param responseBody - A valid Javascript entity to be deserialized
     *
     * @param objectName - Name of the deserialized object
     *
     * @param options - Controls behavior of XML parser and builder.
     *
     * @returns A valid deserialized Javascript object
     */
    deserialize(mapper, responseBody, objectName, options = { xml: {} }) {
        const updatedOptions = {
            xml: {
                rootName: options.xml.rootName ?? "",
                includeRoot: options.xml.includeRoot ?? false,
                xmlCharKey: options.xml.xmlCharKey ?? _interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_CHARKEY,
            },
            ignoreUnknownProperties: options.ignoreUnknownProperties ?? false,
        };
        if (responseBody === undefined || responseBody === null) {
            if (this.isXML && mapper.type.name === "Sequence" && !mapper.xmlIsWrapped) {
                // Edge case for empty XML non-wrapped lists. xml2js can't distinguish
                // between the list being empty versus being missing,
                // so let's do the more user-friendly thing and return an empty list.
                responseBody = [];
            }
            // specifically check for undefined as default value can be a falsey value `0, "", false, null`
            if (mapper.defaultValue !== undefined) {
                responseBody = mapper.defaultValue;
            }
            return responseBody;
        }
        let payload;
        const mapperType = mapper.type.name;
        if (!objectName) {
            objectName = mapper.serializedName;
        }
        if (mapperType.match(/^Composite$/i) !== null) {
            payload = deserializeCompositeType(this, mapper, responseBody, objectName, updatedOptions);
        }
        else {
            if (this.isXML) {
                const xmlCharKey = updatedOptions.xml.xmlCharKey;
                /**
                 * If the mapper specifies this as a non-composite type value but the responseBody contains
                 * both header ("$" i.e., XML_ATTRKEY) and body ("#" i.e., XML_CHARKEY) properties,
                 * then just reduce the responseBody value to the body ("#" i.e., XML_CHARKEY) property.
                 */
                if (responseBody[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] !== undefined && responseBody[xmlCharKey] !== undefined) {
                    responseBody = responseBody[xmlCharKey];
                }
            }
            if (mapperType.match(/^Number$/i) !== null) {
                payload = parseFloat(responseBody);
                if (isNaN(payload)) {
                    payload = responseBody;
                }
            }
            else if (mapperType.match(/^Boolean$/i) !== null) {
                if (responseBody === "true") {
                    payload = true;
                }
                else if (responseBody === "false") {
                    payload = false;
                }
                else {
                    payload = responseBody;
                }
            }
            else if (mapperType.match(/^(String|Enum|Object|Stream|Uuid|TimeSpan|any)$/i) !== null) {
                payload = responseBody;
            }
            else if (mapperType.match(/^(Date|DateTime|DateTimeRfc1123)$/i) !== null) {
                payload = new Date(responseBody);
            }
            else if (mapperType.match(/^UnixTime$/i) !== null) {
                payload = unixTimeToDate(responseBody);
            }
            else if (mapperType.match(/^ByteArray$/i) !== null) {
                payload = _base64_js__WEBPACK_IMPORTED_MODULE_0__.decodeString(responseBody);
            }
            else if (mapperType.match(/^Base64Url$/i) !== null) {
                payload = base64UrlToByteArray(responseBody);
            }
            else if (mapperType.match(/^Sequence$/i) !== null) {
                payload = deserializeSequenceType(this, mapper, responseBody, objectName, updatedOptions);
            }
            else if (mapperType.match(/^Dictionary$/i) !== null) {
                payload = deserializeDictionaryType(this, mapper, responseBody, objectName, updatedOptions);
            }
        }
        if (mapper.isConstant) {
            payload = mapper.defaultValue;
        }
        return payload;
    }
}
/**
 * Method that creates and returns a Serializer.
 * @param modelMappers - Known models to map
 * @param isXML - If XML should be supported
 */
function createSerializer(modelMappers = {}, isXML = false) {
    return new SerializerImpl(modelMappers, isXML);
}
function trimEnd(str, ch) {
    let len = str.length;
    while (len - 1 >= 0 && str[len - 1] === ch) {
        --len;
    }
    return str.substr(0, len);
}
function bufferToBase64Url(buffer) {
    if (!buffer) {
        return undefined;
    }
    if (!(buffer instanceof Uint8Array)) {
        throw new Error(`Please provide an input of type Uint8Array for converting to Base64Url.`);
    }
    // Uint8Array to Base64.
    const str = _base64_js__WEBPACK_IMPORTED_MODULE_0__.encodeByteArray(buffer);
    // Base64 to Base64Url.
    return trimEnd(str, "=").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64UrlToByteArray(str) {
    if (!str) {
        return undefined;
    }
    if (str && typeof str.valueOf() !== "string") {
        throw new Error("Please provide an input of type string for converting to Uint8Array");
    }
    // Base64Url to Base64.
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    // Base64 to Uint8Array.
    return _base64_js__WEBPACK_IMPORTED_MODULE_0__.decodeString(str);
}
function splitSerializeName(prop) {
    const classes = [];
    let partialclass = "";
    if (prop) {
        const subwords = prop.split(".");
        for (const item of subwords) {
            if (item.charAt(item.length - 1) === "\\") {
                partialclass += item.substr(0, item.length - 1) + ".";
            }
            else {
                partialclass += item;
                classes.push(partialclass);
                partialclass = "";
            }
        }
    }
    return classes;
}
function dateToUnixTime(d) {
    if (!d) {
        return undefined;
    }
    if (typeof d.valueOf() === "string") {
        d = new Date(d);
    }
    return Math.floor(d.getTime() / 1000);
}
function unixTimeToDate(n) {
    if (!n) {
        return undefined;
    }
    return new Date(n * 1000);
}
function serializeBasicTypes(typeName, objectName, value) {
    if (value !== null && value !== undefined) {
        if (typeName.match(/^Number$/i) !== null) {
            if (typeof value !== "number") {
                throw new Error(`${objectName} with value ${value} must be of type number.`);
            }
        }
        else if (typeName.match(/^String$/i) !== null) {
            if (typeof value.valueOf() !== "string") {
                throw new Error(`${objectName} with value "${value}" must be of type string.`);
            }
        }
        else if (typeName.match(/^Uuid$/i) !== null) {
            if (!(typeof value.valueOf() === "string" && (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isValidUuid)(value))) {
                throw new Error(`${objectName} with value "${value}" must be of type string and a valid uuid.`);
            }
        }
        else if (typeName.match(/^Boolean$/i) !== null) {
            if (typeof value !== "boolean") {
                throw new Error(`${objectName} with value ${value} must be of type boolean.`);
            }
        }
        else if (typeName.match(/^Stream$/i) !== null) {
            const objectType = typeof value;
            if (objectType !== "string" &&
                typeof value.pipe !== "function" && // NodeJS.ReadableStream
                typeof value.tee !== "function" && // browser ReadableStream
                !(value instanceof ArrayBuffer) &&
                !ArrayBuffer.isView(value) &&
                // File objects count as a type of Blob, so we want to use instanceof explicitly
                !((typeof Blob === "function" || typeof Blob === "object") && value instanceof Blob) &&
                objectType !== "function") {
                throw new Error(`${objectName} must be a string, Blob, ArrayBuffer, ArrayBufferView, ReadableStream, or () => ReadableStream.`);
            }
        }
    }
    return value;
}
function serializeEnumType(objectName, allowedValues, value) {
    if (!allowedValues) {
        throw new Error(`Please provide a set of allowedValues to validate ${objectName} as an Enum Type.`);
    }
    const isPresent = allowedValues.some((item) => {
        if (typeof item.valueOf() === "string") {
            return item.toLowerCase() === value.toLowerCase();
        }
        return item === value;
    });
    if (!isPresent) {
        throw new Error(`${value} is not a valid value for ${objectName}. The valid values are: ${JSON.stringify(allowedValues)}.`);
    }
    return value;
}
function serializeByteArrayType(objectName, value) {
    if (value !== undefined && value !== null) {
        if (!(value instanceof Uint8Array)) {
            throw new Error(`${objectName} must be of type Uint8Array.`);
        }
        value = _base64_js__WEBPACK_IMPORTED_MODULE_0__.encodeByteArray(value);
    }
    return value;
}
function serializeBase64UrlType(objectName, value) {
    if (value !== undefined && value !== null) {
        if (!(value instanceof Uint8Array)) {
            throw new Error(`${objectName} must be of type Uint8Array.`);
        }
        value = bufferToBase64Url(value);
    }
    return value;
}
function serializeDateTypes(typeName, value, objectName) {
    if (value !== undefined && value !== null) {
        if (typeName.match(/^Date$/i) !== null) {
            if (!(value instanceof Date ||
                (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                throw new Error(`${objectName} must be an instanceof Date or a string in ISO8601 format.`);
            }
            value =
                value instanceof Date
                    ? value.toISOString().substring(0, 10)
                    : new Date(value).toISOString().substring(0, 10);
        }
        else if (typeName.match(/^DateTime$/i) !== null) {
            if (!(value instanceof Date ||
                (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                throw new Error(`${objectName} must be an instanceof Date or a string in ISO8601 format.`);
            }
            value = value instanceof Date ? value.toISOString() : new Date(value).toISOString();
        }
        else if (typeName.match(/^DateTimeRfc1123$/i) !== null) {
            if (!(value instanceof Date ||
                (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                throw new Error(`${objectName} must be an instanceof Date or a string in RFC-1123 format.`);
            }
            value = value instanceof Date ? value.toUTCString() : new Date(value).toUTCString();
        }
        else if (typeName.match(/^UnixTime$/i) !== null) {
            if (!(value instanceof Date ||
                (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                throw new Error(`${objectName} must be an instanceof Date or a string in RFC-1123/ISO8601 format ` +
                    `for it to be serialized in UnixTime/Epoch format.`);
            }
            value = dateToUnixTime(value);
        }
        else if (typeName.match(/^TimeSpan$/i) !== null) {
            if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isDuration)(value)) {
                throw new Error(`${objectName} must be a string in ISO 8601 format. Instead was "${value}".`);
            }
        }
    }
    return value;
}
function serializeSequenceType(serializer, mapper, object, objectName, isXml, options) {
    if (!Array.isArray(object)) {
        throw new Error(`${objectName} must be of type Array.`);
    }
    let elementType = mapper.type.element;
    if (!elementType || typeof elementType !== "object") {
        throw new Error(`element" metadata for an Array must be defined in the ` +
            `mapper and it must of type "object" in ${objectName}.`);
    }
    // Quirk: Composite mappers referenced by `element` might
    // not have *all* properties declared (like uberParent),
    // so let's try to look up the full definition by name.
    if (elementType.type.name === "Composite" && elementType.type.className) {
        elementType = serializer.modelMappers[elementType.type.className] ?? elementType;
    }
    const tempArray = [];
    for (let i = 0; i < object.length; i++) {
        const serializedValue = serializer.serialize(elementType, object[i], objectName, options);
        if (isXml && elementType.xmlNamespace) {
            const xmlnsKey = elementType.xmlNamespacePrefix
                ? `xmlns:${elementType.xmlNamespacePrefix}`
                : "xmlns";
            if (elementType.type.name === "Composite") {
                tempArray[i] = { ...serializedValue };
                tempArray[i][_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] = { [xmlnsKey]: elementType.xmlNamespace };
            }
            else {
                tempArray[i] = {};
                tempArray[i][options.xml.xmlCharKey] = serializedValue;
                tempArray[i][_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] = { [xmlnsKey]: elementType.xmlNamespace };
            }
        }
        else {
            tempArray[i] = serializedValue;
        }
    }
    return tempArray;
}
function serializeDictionaryType(serializer, mapper, object, objectName, isXml, options) {
    if (typeof object !== "object") {
        throw new Error(`${objectName} must be of type object.`);
    }
    const valueType = mapper.type.value;
    if (!valueType || typeof valueType !== "object") {
        throw new Error(`"value" metadata for a Dictionary must be defined in the ` +
            `mapper and it must of type "object" in ${objectName}.`);
    }
    const tempDictionary = {};
    for (const key of Object.keys(object)) {
        const serializedValue = serializer.serialize(valueType, object[key], objectName, options);
        // If the element needs an XML namespace we need to add it within the $ property
        tempDictionary[key] = getXmlObjectValue(valueType, serializedValue, isXml, options);
    }
    // Add the namespace to the root element if needed
    if (isXml && mapper.xmlNamespace) {
        const xmlnsKey = mapper.xmlNamespacePrefix ? `xmlns:${mapper.xmlNamespacePrefix}` : "xmlns";
        const result = tempDictionary;
        result[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] = { [xmlnsKey]: mapper.xmlNamespace };
        return result;
    }
    return tempDictionary;
}
/**
 * Resolves the additionalProperties property from a referenced mapper
 * @param serializer - the serializer containing the entire set of mappers
 * @param mapper - the composite mapper to resolve
 * @param objectName - name of the object being serialized
 */
function resolveAdditionalProperties(serializer, mapper, objectName) {
    const additionalProperties = mapper.type.additionalProperties;
    if (!additionalProperties && mapper.type.className) {
        const modelMapper = resolveReferencedMapper(serializer, mapper, objectName);
        return modelMapper?.type.additionalProperties;
    }
    return additionalProperties;
}
/**
 * Finds the mapper referenced by className
 * @param serializer - the serializer containing the entire set of mappers
 * @param mapper - the composite mapper to resolve
 * @param objectName - name of the object being serialized
 */
function resolveReferencedMapper(serializer, mapper, objectName) {
    const className = mapper.type.className;
    if (!className) {
        throw new Error(`Class name for model "${objectName}" is not provided in the mapper "${JSON.stringify(mapper, undefined, 2)}".`);
    }
    return serializer.modelMappers[className];
}
/**
 * Resolves a composite mapper's modelProperties.
 * @param serializer - the serializer containing the entire set of mappers
 * @param mapper - the composite mapper to resolve
 */
function resolveModelProperties(serializer, mapper, objectName) {
    let modelProps = mapper.type.modelProperties;
    if (!modelProps) {
        const modelMapper = resolveReferencedMapper(serializer, mapper, objectName);
        if (!modelMapper) {
            throw new Error(`mapper() cannot be null or undefined for model "${mapper.type.className}".`);
        }
        modelProps = modelMapper?.type.modelProperties;
        if (!modelProps) {
            throw new Error(`modelProperties cannot be null or undefined in the ` +
                `mapper "${JSON.stringify(modelMapper)}" of type "${mapper.type.className}" for object "${objectName}".`);
        }
    }
    return modelProps;
}
function serializeCompositeType(serializer, mapper, object, objectName, isXml, options) {
    if (getPolymorphicDiscriminatorRecursively(serializer, mapper)) {
        mapper = getPolymorphicMapper(serializer, mapper, object, "clientName");
    }
    if (object !== undefined && object !== null) {
        const payload = {};
        const modelProps = resolveModelProperties(serializer, mapper, objectName);
        for (const key of Object.keys(modelProps)) {
            const propertyMapper = modelProps[key];
            if (propertyMapper.readOnly) {
                continue;
            }
            let propName;
            let parentObject = payload;
            if (serializer.isXML) {
                if (propertyMapper.xmlIsWrapped) {
                    propName = propertyMapper.xmlName;
                }
                else {
                    propName = propertyMapper.xmlElementName || propertyMapper.xmlName;
                }
            }
            else {
                const paths = splitSerializeName(propertyMapper.serializedName);
                propName = paths.pop();
                for (const pathName of paths) {
                    const childObject = parentObject[pathName];
                    if ((childObject === undefined || childObject === null) &&
                        ((object[key] !== undefined && object[key] !== null) ||
                            propertyMapper.defaultValue !== undefined)) {
                        parentObject[pathName] = {};
                    }
                    parentObject = parentObject[pathName];
                }
            }
            if (parentObject !== undefined && parentObject !== null) {
                if (isXml && mapper.xmlNamespace) {
                    const xmlnsKey = mapper.xmlNamespacePrefix
                        ? `xmlns:${mapper.xmlNamespacePrefix}`
                        : "xmlns";
                    parentObject[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] = {
                        ...parentObject[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY],
                        [xmlnsKey]: mapper.xmlNamespace,
                    };
                }
                const propertyObjectName = propertyMapper.serializedName !== ""
                    ? objectName + "." + propertyMapper.serializedName
                    : objectName;
                let toSerialize = object[key];
                const polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer, mapper);
                if (polymorphicDiscriminator &&
                    polymorphicDiscriminator.clientName === key &&
                    (toSerialize === undefined || toSerialize === null)) {
                    toSerialize = mapper.serializedName;
                }
                const serializedValue = serializer.serialize(propertyMapper, toSerialize, propertyObjectName, options);
                if (serializedValue !== undefined && propName !== undefined && propName !== null) {
                    const value = getXmlObjectValue(propertyMapper, serializedValue, isXml, options);
                    if (isXml && propertyMapper.xmlIsAttribute) {
                        // XML_ATTRKEY, i.e., $ is the key attributes are kept under in xml2js.
                        // This keeps things simple while preventing name collision
                        // with names in user documents.
                        parentObject[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] = parentObject[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] || {};
                        parentObject[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY][propName] = serializedValue;
                    }
                    else if (isXml && propertyMapper.xmlIsWrapped) {
                        parentObject[propName] = { [propertyMapper.xmlElementName]: value };
                    }
                    else {
                        parentObject[propName] = value;
                    }
                }
            }
        }
        const additionalPropertiesMapper = resolveAdditionalProperties(serializer, mapper, objectName);
        if (additionalPropertiesMapper) {
            const propNames = Object.keys(modelProps);
            for (const clientPropName in object) {
                const isAdditionalProperty = propNames.every((pn) => pn !== clientPropName);
                if (isAdditionalProperty) {
                    payload[clientPropName] = serializer.serialize(additionalPropertiesMapper, object[clientPropName], objectName + '["' + clientPropName + '"]', options);
                }
            }
        }
        return payload;
    }
    return object;
}
function getXmlObjectValue(propertyMapper, serializedValue, isXml, options) {
    if (!isXml || !propertyMapper.xmlNamespace) {
        return serializedValue;
    }
    const xmlnsKey = propertyMapper.xmlNamespacePrefix
        ? `xmlns:${propertyMapper.xmlNamespacePrefix}`
        : "xmlns";
    const xmlNamespace = { [xmlnsKey]: propertyMapper.xmlNamespace };
    if (["Composite"].includes(propertyMapper.type.name)) {
        if (serializedValue[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY]) {
            return serializedValue;
        }
        else {
            const result = { ...serializedValue };
            result[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] = xmlNamespace;
            return result;
        }
    }
    const result = {};
    result[options.xml.xmlCharKey] = serializedValue;
    result[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY] = xmlNamespace;
    return result;
}
function isSpecialXmlProperty(propertyName, options) {
    return [_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY, options.xml.xmlCharKey].includes(propertyName);
}
function deserializeCompositeType(serializer, mapper, responseBody, objectName, options) {
    const xmlCharKey = options.xml.xmlCharKey ?? _interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_CHARKEY;
    if (getPolymorphicDiscriminatorRecursively(serializer, mapper)) {
        mapper = getPolymorphicMapper(serializer, mapper, responseBody, "serializedName");
    }
    const modelProps = resolveModelProperties(serializer, mapper, objectName);
    let instance = {};
    const handledPropertyNames = [];
    for (const key of Object.keys(modelProps)) {
        const propertyMapper = modelProps[key];
        const paths = splitSerializeName(modelProps[key].serializedName);
        handledPropertyNames.push(paths[0]);
        const { serializedName, xmlName, xmlElementName } = propertyMapper;
        let propertyObjectName = objectName;
        if (serializedName !== "" && serializedName !== undefined) {
            propertyObjectName = objectName + "." + serializedName;
        }
        const headerCollectionPrefix = propertyMapper.headerCollectionPrefix;
        if (headerCollectionPrefix) {
            const dictionary = {};
            for (const headerKey of Object.keys(responseBody)) {
                if (headerKey.startsWith(headerCollectionPrefix)) {
                    dictionary[headerKey.substring(headerCollectionPrefix.length)] = serializer.deserialize(propertyMapper.type.value, responseBody[headerKey], propertyObjectName, options);
                }
                handledPropertyNames.push(headerKey);
            }
            instance[key] = dictionary;
        }
        else if (serializer.isXML) {
            if (propertyMapper.xmlIsAttribute && responseBody[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY]) {
                instance[key] = serializer.deserialize(propertyMapper, responseBody[_interfaces_js__WEBPACK_IMPORTED_MODULE_1__.XML_ATTRKEY][xmlName], propertyObjectName, options);
            }
            else if (propertyMapper.xmlIsMsText) {
                if (responseBody[xmlCharKey] !== undefined) {
                    instance[key] = responseBody[xmlCharKey];
                }
                else if (typeof responseBody === "string") {
                    // The special case where xml parser parses "<Name>content</Name>" into JSON of
                    //   `{ name: "content"}` instead of `{ name: { "_": "content" }}`
                    instance[key] = responseBody;
                }
            }
            else {
                const propertyName = xmlElementName || xmlName || serializedName;
                if (propertyMapper.xmlIsWrapped) {
                    /* a list of <xmlElementName> wrapped by <xmlName>
                      For the xml example below
                        <Cors>
                          <CorsRule>...</CorsRule>
                          <CorsRule>...</CorsRule>
                        </Cors>
                      the responseBody has
                        {
                          Cors: {
                            CorsRule: [{...}, {...}]
                          }
                        }
                      xmlName is "Cors" and xmlElementName is"CorsRule".
                    */
                    const wrapped = responseBody[xmlName];
                    const elementList = wrapped?.[xmlElementName] ?? [];
                    instance[key] = serializer.deserialize(propertyMapper, elementList, propertyObjectName, options);
                    handledPropertyNames.push(xmlName);
                }
                else {
                    const property = responseBody[propertyName];
                    instance[key] = serializer.deserialize(propertyMapper, property, propertyObjectName, options);
                    handledPropertyNames.push(propertyName);
                }
            }
        }
        else {
            // deserialize the property if it is present in the provided responseBody instance
            let propertyInstance;
            let res = responseBody;
            // traversing the object step by step.
            let steps = 0;
            for (const item of paths) {
                if (!res)
                    break;
                steps++;
                res = res[item];
            }
            // only accept null when reaching the last position of object otherwise it would be undefined
            if (res === null && steps < paths.length) {
                res = undefined;
            }
            propertyInstance = res;
            const polymorphicDiscriminator = mapper.type.polymorphicDiscriminator;
            // checking that the model property name (key)(ex: "fishtype") and the
            // clientName of the polymorphicDiscriminator {metadata} (ex: "fishtype")
            // instead of the serializedName of the polymorphicDiscriminator (ex: "fish.type")
            // is a better approach. The generator is not consistent with escaping '\.' in the
            // serializedName of the property (ex: "fish\.type") that is marked as polymorphic discriminator
            // and the serializedName of the metadata polymorphicDiscriminator (ex: "fish.type"). However,
            // the clientName transformation of the polymorphicDiscriminator (ex: "fishtype") and
            // the transformation of model property name (ex: "fishtype") is done consistently.
            // Hence, it is a safer bet to rely on the clientName of the polymorphicDiscriminator.
            if (polymorphicDiscriminator &&
                key === polymorphicDiscriminator.clientName &&
                (propertyInstance === undefined || propertyInstance === null)) {
                propertyInstance = mapper.serializedName;
            }
            let serializedValue;
            // paging
            if (Array.isArray(responseBody[key]) && modelProps[key].serializedName === "") {
                propertyInstance = responseBody[key];
                const arrayInstance = serializer.deserialize(propertyMapper, propertyInstance, propertyObjectName, options);
                // Copy over any properties that have already been added into the instance, where they do
                // not exist on the newly de-serialized array
                for (const [k, v] of Object.entries(instance)) {
                    if (!Object.prototype.hasOwnProperty.call(arrayInstance, k)) {
                        arrayInstance[k] = v;
                    }
                }
                instance = arrayInstance;
            }
            else if (propertyInstance !== undefined || propertyMapper.defaultValue !== undefined) {
                serializedValue = serializer.deserialize(propertyMapper, propertyInstance, propertyObjectName, options);
                instance[key] = serializedValue;
            }
        }
    }
    const additionalPropertiesMapper = mapper.type.additionalProperties;
    if (additionalPropertiesMapper) {
        const isAdditionalProperty = (responsePropName) => {
            for (const clientPropName in modelProps) {
                const paths = splitSerializeName(modelProps[clientPropName].serializedName);
                if (paths[0] === responsePropName) {
                    return false;
                }
            }
            return true;
        };
        for (const responsePropName in responseBody) {
            if (isAdditionalProperty(responsePropName)) {
                instance[responsePropName] = serializer.deserialize(additionalPropertiesMapper, responseBody[responsePropName], objectName + '["' + responsePropName + '"]', options);
            }
        }
    }
    else if (responseBody && !options.ignoreUnknownProperties) {
        for (const key of Object.keys(responseBody)) {
            if (instance[key] === undefined &&
                !handledPropertyNames.includes(key) &&
                !isSpecialXmlProperty(key, options)) {
                instance[key] = responseBody[key];
            }
        }
    }
    return instance;
}
function deserializeDictionaryType(serializer, mapper, responseBody, objectName, options) {
    /* jshint validthis: true */
    const value = mapper.type.value;
    if (!value || typeof value !== "object") {
        throw new Error(`"value" metadata for a Dictionary must be defined in the ` +
            `mapper and it must of type "object" in ${objectName}`);
    }
    if (responseBody) {
        const tempDictionary = {};
        for (const key of Object.keys(responseBody)) {
            tempDictionary[key] = serializer.deserialize(value, responseBody[key], objectName, options);
        }
        return tempDictionary;
    }
    return responseBody;
}
function deserializeSequenceType(serializer, mapper, responseBody, objectName, options) {
    let element = mapper.type.element;
    if (!element || typeof element !== "object") {
        throw new Error(`element" metadata for an Array must be defined in the ` +
            `mapper and it must of type "object" in ${objectName}`);
    }
    if (responseBody) {
        if (!Array.isArray(responseBody)) {
            // xml2js will interpret a single element array as just the element, so force it to be an array
            responseBody = [responseBody];
        }
        // Quirk: Composite mappers referenced by `element` might
        // not have *all* properties declared (like uberParent),
        // so let's try to look up the full definition by name.
        if (element.type.name === "Composite" && element.type.className) {
            element = serializer.modelMappers[element.type.className] ?? element;
        }
        const tempArray = [];
        for (let i = 0; i < responseBody.length; i++) {
            tempArray[i] = serializer.deserialize(element, responseBody[i], `${objectName}[${i}]`, options);
        }
        return tempArray;
    }
    return responseBody;
}
function getIndexDiscriminator(discriminators, discriminatorValue, typeName) {
    const typeNamesToCheck = [typeName];
    while (typeNamesToCheck.length) {
        const currentName = typeNamesToCheck.shift();
        const indexDiscriminator = discriminatorValue === currentName
            ? discriminatorValue
            : currentName + "." + discriminatorValue;
        if (Object.prototype.hasOwnProperty.call(discriminators, indexDiscriminator)) {
            return discriminators[indexDiscriminator];
        }
        else {
            for (const [name, mapper] of Object.entries(discriminators)) {
                if (name.startsWith(currentName + ".") &&
                    mapper.type.uberParent === currentName &&
                    mapper.type.className) {
                    typeNamesToCheck.push(mapper.type.className);
                }
            }
        }
    }
    return undefined;
}
function getPolymorphicMapper(serializer, mapper, object, polymorphicPropertyName) {
    const polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer, mapper);
    if (polymorphicDiscriminator) {
        let discriminatorName = polymorphicDiscriminator[polymorphicPropertyName];
        if (discriminatorName) {
            // The serializedName might have \\, which we just want to ignore
            if (polymorphicPropertyName === "serializedName") {
                discriminatorName = discriminatorName.replace(/\\/gi, "");
            }
            const discriminatorValue = object[discriminatorName];
            const typeName = mapper.type.uberParent ?? mapper.type.className;
            if (typeof discriminatorValue === "string" && typeName) {
                const polymorphicMapper = getIndexDiscriminator(serializer.modelMappers.discriminators, discriminatorValue, typeName);
                if (polymorphicMapper) {
                    mapper = polymorphicMapper;
                }
            }
        }
    }
    return mapper;
}
function getPolymorphicDiscriminatorRecursively(serializer, mapper) {
    return (mapper.type.polymorphicDiscriminator ||
        getPolymorphicDiscriminatorSafely(serializer, mapper.type.uberParent) ||
        getPolymorphicDiscriminatorSafely(serializer, mapper.type.className));
}
function getPolymorphicDiscriminatorSafely(serializer, typeName) {
    return (typeName &&
        serializer.modelMappers[typeName] &&
        serializer.modelMappers[typeName].type.polymorphicDiscriminator);
}
/**
 * Known types of Mappers
 */
const MapperTypeNames = {
    Base64Url: "Base64Url",
    Boolean: "Boolean",
    ByteArray: "ByteArray",
    Composite: "Composite",
    Date: "Date",
    DateTime: "DateTime",
    DateTimeRfc1123: "DateTimeRfc1123",
    Dictionary: "Dictionary",
    Enum: "Enum",
    Number: "Number",
    Object: "Object",
    Sequence: "Sequence",
    String: "String",
    Stream: "Stream",
    TimeSpan: "TimeSpan",
    UnixTime: "UnixTime",
};
//# sourceMappingURL=serializer.js.map

/***/ },

/***/ 2101
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServiceClient: () => (/* binding */ ServiceClient)
/* harmony export */ });
/* harmony import */ var _azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2102);
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2214);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2100);
/* harmony import */ var _httpClientCache_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2221);
/* harmony import */ var _operationHelpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2216);
/* harmony import */ var _urlHelpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2222);
/* harmony import */ var _interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2220);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2223);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.








/**
 * Initializes a new instance of the ServiceClient.
 */
class ServiceClient {
    /**
     * If specified, this is the base URI that requests will be made against for this ServiceClient.
     * If it is not specified, then all OperationSpecs must contain a baseUrl property.
     */
    _endpoint;
    /**
     * The default request content type for the service.
     * Used if no requestContentType is present on an OperationSpec.
     */
    _requestContentType;
    /**
     * Set to true if the request is sent over HTTP instead of HTTPS
     */
    _allowInsecureConnection;
    /**
     * The HTTP client that will be used to send requests.
     */
    _httpClient;
    /**
     * The pipeline used by this client to make requests
     */
    pipeline;
    /**
     * The ServiceClient constructor
     * @param options - The service client options that govern the behavior of the client.
     */
    constructor(options = {}) {
        this._requestContentType = options.requestContentType;
        this._endpoint = options.endpoint ?? options.baseUri;
        if (options.baseUri) {
            _log_js__WEBPACK_IMPORTED_MODULE_7__.logger.warning("The baseUri option for SDK Clients has been deprecated, please use endpoint instead.");
        }
        this._allowInsecureConnection = options.allowInsecureConnection;
        this._httpClient = options.httpClient || (0,_httpClientCache_js__WEBPACK_IMPORTED_MODULE_3__.getCachedDefaultHttpClient)();
        this.pipeline = options.pipeline || createDefaultPipeline(options);
        if (options.additionalPolicies?.length) {
            for (const { policy, position } of options.additionalPolicies) {
                // Sign happens after Retry and is commonly needed to occur
                // before policies that intercept post-retry.
                const afterPhase = position === "perRetry" ? "Sign" : undefined;
                this.pipeline.addPolicy(policy, {
                    afterPhase,
                });
            }
        }
    }
    /**
     * Send the provided httpRequest.
     */
    async sendRequest(request) {
        return this.pipeline.sendRequest(this._httpClient, request);
    }
    /**
     * Send an HTTP request that is populated using the provided OperationSpec.
     * @typeParam T - The typed result of the request, based on the OperationSpec.
     * @param operationArguments - The arguments that the HTTP request's templated values will be populated from.
     * @param operationSpec - The OperationSpec to use to populate the httpRequest.
     */
    async sendOperationRequest(operationArguments, operationSpec) {
        const endpoint = operationSpec.baseUrl || this._endpoint;
        if (!endpoint) {
            throw new Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.");
        }
        // Templatized URLs sometimes reference properties on the ServiceClient child class,
        // so we have to pass `this` below in order to search these properties if they're
        // not part of OperationArguments
        const url = (0,_urlHelpers_js__WEBPACK_IMPORTED_MODULE_5__.getRequestUrl)(endpoint, operationSpec, operationArguments, this);
        const request = (0,_azure_core_rest_pipeline__WEBPACK_IMPORTED_MODULE_0__.createPipelineRequest)({
            url,
        });
        request.method = operationSpec.httpMethod;
        const operationInfo = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_4__.getOperationRequestInfo)(request);
        operationInfo.operationSpec = operationSpec;
        operationInfo.operationArguments = operationArguments;
        const contentType = operationSpec.contentType || this._requestContentType;
        if (contentType && operationSpec.requestBody) {
            request.headers.set("Content-Type", contentType);
        }
        const options = operationArguments.options;
        if (options) {
            const requestOptions = options.requestOptions;
            if (requestOptions) {
                if (requestOptions.timeout) {
                    request.timeout = requestOptions.timeout;
                }
                if (requestOptions.onUploadProgress) {
                    request.onUploadProgress = requestOptions.onUploadProgress;
                }
                if (requestOptions.onDownloadProgress) {
                    request.onDownloadProgress = requestOptions.onDownloadProgress;
                }
                if (requestOptions.shouldDeserialize !== undefined) {
                    operationInfo.shouldDeserialize = requestOptions.shouldDeserialize;
                }
                if (requestOptions.allowInsecureConnection) {
                    request.allowInsecureConnection = true;
                }
            }
            if (options.abortSignal) {
                request.abortSignal = options.abortSignal;
            }
            if (options.tracingOptions) {
                request.tracingOptions = options.tracingOptions;
            }
        }
        if (this._allowInsecureConnection) {
            request.allowInsecureConnection = true;
        }
        if (request.streamResponseStatusCodes === undefined) {
            request.streamResponseStatusCodes = (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_6__.getStreamingResponseStatusCodes)(operationSpec);
        }
        try {
            const rawResponse = await this.sendRequest(request);
            const flatResponse = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.flattenResponse)(rawResponse, operationSpec.responses[rawResponse.status]);
            if (options?.onResponse) {
                options.onResponse(rawResponse, flatResponse);
            }
            return flatResponse;
        }
        catch (error) {
            if (typeof error === "object" && error?.response) {
                const rawResponse = error.response;
                const flatResponse = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.flattenResponse)(rawResponse, operationSpec.responses[error.statusCode] || operationSpec.responses["default"]);
                error.details = flatResponse;
                if (options?.onResponse) {
                    options.onResponse(rawResponse, flatResponse, error);
                }
            }
            throw error;
        }
    }
}
function createDefaultPipeline(options) {
    const credentialScopes = getCredentialScopes(options);
    const credentialOptions = options.credential && credentialScopes
        ? { credentialScopes, credential: options.credential }
        : undefined;
    return (0,_pipeline_js__WEBPACK_IMPORTED_MODULE_1__.createClientPipeline)({
        ...options,
        credentialOptions,
    });
}
function getCredentialScopes(options) {
    if (options.credentialScopes) {
        return options.credentialScopes;
    }
    if (options.endpoint) {
        return `${options.endpoint}/.default`;
    }
    if (options.baseUri) {
        return `${options.baseUri}/.default`;
    }
    if (options.credential && !options.credentialScopes) {
        throw new Error(`When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy`);
    }
    return undefined;
}
//# sourceMappingURL=serviceClient.js.map

/***/ },

/***/ 2217
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   state: () => (/* binding */ state)
/* harmony export */ });
/* harmony import */ var _commonjs_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2218);
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

/***/ 2222
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appendQueryParams: () => (/* binding */ appendQueryParams),
/* harmony export */   getRequestUrl: () => (/* binding */ getRequestUrl)
/* harmony export */ });
/* harmony import */ var _operationHelpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2216);
/* harmony import */ var _interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2220);
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


const CollectionFormatToDelimiterMap = {
    CSV: ",",
    SSV: " ",
    Multi: "Multi",
    TSV: "\t",
    Pipes: "|",
};
function getRequestUrl(baseUri, operationSpec, operationArguments, fallbackObject) {
    const urlReplacements = calculateUrlReplacements(operationSpec, operationArguments, fallbackObject);
    let isAbsolutePath = false;
    let requestUrl = replaceAll(baseUri, urlReplacements);
    if (operationSpec.path) {
        let path = replaceAll(operationSpec.path, urlReplacements);
        // QUIRK: sometimes we get a path component like /{nextLink}
        // which may be a fully formed URL with a leading /. In that case, we should
        // remove the leading /
        if (operationSpec.path === "/{nextLink}" && path.startsWith("/")) {
            path = path.substring(1);
        }
        // QUIRK: sometimes we get a path component like {nextLink}
        // which may be a fully formed URL. In that case, we should
        // ignore the baseUri.
        if (isAbsoluteUrl(path)) {
            requestUrl = path;
            isAbsolutePath = true;
        }
        else {
            requestUrl = appendPath(requestUrl, path);
        }
    }
    const { queryParams, sequenceParams } = calculateQueryParameters(operationSpec, operationArguments, fallbackObject);
    /**
     * Notice that this call sets the `noOverwrite` parameter to true if the `requestUrl`
     * is an absolute path. This ensures that existing query parameter values in `requestUrl`
     * do not get overwritten. On the other hand when `requestUrl` is not absolute path, it
     * is still being built so there is nothing to overwrite.
     */
    requestUrl = appendQueryParams(requestUrl, queryParams, sequenceParams, isAbsolutePath);
    return requestUrl;
}
function replaceAll(input, replacements) {
    let result = input;
    for (const [searchValue, replaceValue] of replacements) {
        result = result.split(searchValue).join(replaceValue);
    }
    return result;
}
function calculateUrlReplacements(operationSpec, operationArguments, fallbackObject) {
    const result = new Map();
    if (operationSpec.urlParameters?.length) {
        for (const urlParameter of operationSpec.urlParameters) {
            let urlParameterValue = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_0__.getOperationArgumentValueFromParameter)(operationArguments, urlParameter, fallbackObject);
            const parameterPathString = (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_1__.getPathStringFromParameter)(urlParameter);
            urlParameterValue = operationSpec.serializer.serialize(urlParameter.mapper, urlParameterValue, parameterPathString);
            if (!urlParameter.skipEncoding) {
                urlParameterValue = encodeURIComponent(urlParameterValue);
            }
            result.set(`{${urlParameter.mapper.serializedName || parameterPathString}}`, urlParameterValue);
        }
    }
    return result;
}
function isAbsoluteUrl(url) {
    return url.includes("://");
}
function appendPath(url, pathToAppend) {
    if (!pathToAppend) {
        return url;
    }
    const parsedUrl = new URL(url);
    let newPath = parsedUrl.pathname;
    if (!newPath.endsWith("/")) {
        newPath = `${newPath}/`;
    }
    if (pathToAppend.startsWith("/")) {
        pathToAppend = pathToAppend.substring(1);
    }
    const searchStart = pathToAppend.indexOf("?");
    if (searchStart !== -1) {
        const path = pathToAppend.substring(0, searchStart);
        const search = pathToAppend.substring(searchStart + 1);
        newPath = newPath + path;
        if (search) {
            parsedUrl.search = parsedUrl.search ? `${parsedUrl.search}&${search}` : search;
        }
    }
    else {
        newPath = newPath + pathToAppend;
    }
    parsedUrl.pathname = newPath;
    return parsedUrl.toString();
}
function calculateQueryParameters(operationSpec, operationArguments, fallbackObject) {
    const result = new Map();
    const sequenceParams = new Set();
    if (operationSpec.queryParameters?.length) {
        for (const queryParameter of operationSpec.queryParameters) {
            if (queryParameter.mapper.type.name === "Sequence" && queryParameter.mapper.serializedName) {
                sequenceParams.add(queryParameter.mapper.serializedName);
            }
            let queryParameterValue = (0,_operationHelpers_js__WEBPACK_IMPORTED_MODULE_0__.getOperationArgumentValueFromParameter)(operationArguments, queryParameter, fallbackObject);
            if ((queryParameterValue !== undefined && queryParameterValue !== null) ||
                queryParameter.mapper.required) {
                queryParameterValue = operationSpec.serializer.serialize(queryParameter.mapper, queryParameterValue, (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_1__.getPathStringFromParameter)(queryParameter));
                const delimiter = queryParameter.collectionFormat
                    ? CollectionFormatToDelimiterMap[queryParameter.collectionFormat]
                    : "";
                if (Array.isArray(queryParameterValue)) {
                    // replace null and undefined
                    queryParameterValue = queryParameterValue.map((item) => {
                        if (item === null || item === undefined) {
                            return "";
                        }
                        return item;
                    });
                }
                if (queryParameter.collectionFormat === "Multi" && queryParameterValue.length === 0) {
                    continue;
                }
                else if (Array.isArray(queryParameterValue) &&
                    (queryParameter.collectionFormat === "SSV" || queryParameter.collectionFormat === "TSV")) {
                    queryParameterValue = queryParameterValue.join(delimiter);
                }
                if (!queryParameter.skipEncoding) {
                    if (Array.isArray(queryParameterValue)) {
                        queryParameterValue = queryParameterValue.map((item) => {
                            return encodeURIComponent(item);
                        });
                    }
                    else {
                        queryParameterValue = encodeURIComponent(queryParameterValue);
                    }
                }
                // Join pipes and CSV *after* encoding, or the server will be upset.
                if (Array.isArray(queryParameterValue) &&
                    (queryParameter.collectionFormat === "CSV" || queryParameter.collectionFormat === "Pipes")) {
                    queryParameterValue = queryParameterValue.join(delimiter);
                }
                result.set(queryParameter.mapper.serializedName || (0,_interfaceHelpers_js__WEBPACK_IMPORTED_MODULE_1__.getPathStringFromParameter)(queryParameter), queryParameterValue);
            }
        }
    }
    return {
        queryParams: result,
        sequenceParams,
    };
}
function simpleParseQueryParams(queryString) {
    const result = new Map();
    if (!queryString || queryString[0] !== "?") {
        return result;
    }
    // remove the leading ?
    queryString = queryString.slice(1);
    const pairs = queryString.split("&");
    for (const pair of pairs) {
        const [name, value] = pair.split("=", 2);
        const existingValue = result.get(name);
        if (existingValue) {
            if (Array.isArray(existingValue)) {
                existingValue.push(value);
            }
            else {
                result.set(name, [existingValue, value]);
            }
        }
        else {
            result.set(name, value);
        }
    }
    return result;
}
/** @internal */
function appendQueryParams(url, queryParams, sequenceParams, noOverwrite = false) {
    if (queryParams.size === 0) {
        return url;
    }
    const parsedUrl = new URL(url);
    // QUIRK: parsedUrl.searchParams will have their name/value pairs decoded, which
    // can change their meaning to the server, such as in the case of a SAS signature.
    // To avoid accidentally un-encoding a query param, we parse the key/values ourselves
    const combinedParams = simpleParseQueryParams(parsedUrl.search);
    for (const [name, value] of queryParams) {
        const existingValue = combinedParams.get(name);
        if (Array.isArray(existingValue)) {
            if (Array.isArray(value)) {
                existingValue.push(...value);
                const valueSet = new Set(existingValue);
                combinedParams.set(name, Array.from(valueSet));
            }
            else {
                existingValue.push(value);
            }
        }
        else if (existingValue) {
            if (Array.isArray(value)) {
                value.unshift(existingValue);
            }
            else if (sequenceParams.has(name)) {
                combinedParams.set(name, [existingValue, value]);
            }
            if (!noOverwrite) {
                combinedParams.set(name, value);
            }
        }
        else {
            combinedParams.set(name, value);
        }
    }
    const searchPieces = [];
    for (const [name, value] of combinedParams) {
        if (typeof value === "string") {
            searchPieces.push(`${name}=${value}`);
        }
        else if (Array.isArray(value)) {
            // QUIRK: If we get an array of values, include multiple key/value pairs
            for (const subValue of value) {
                searchPieces.push(`${name}=${subValue}`);
            }
        }
        else {
            searchPieces.push(`${name}=${value}`);
        }
    }
    // QUIRK: we have to set search manually as searchParams will encode comma when it shouldn't.
    parsedUrl.search = searchPieces.length ? `?${searchPieces.join("&")}` : "";
    return parsedUrl.toString();
}
//# sourceMappingURL=urlHelpers.js.map

/***/ },

/***/ 2100
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   flattenResponse: () => (/* binding */ flattenResponse),
/* harmony export */   isDuration: () => (/* binding */ isDuration),
/* harmony export */   isPrimitiveBody: () => (/* binding */ isPrimitiveBody),
/* harmony export */   isValidUuid: () => (/* binding */ isValidUuid)
/* harmony export */ });
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * A type guard for a primitive response body.
 * @param value - Value to test
 *
 * @internal
 */
function isPrimitiveBody(value, mapperTypeName) {
    return (mapperTypeName !== "Composite" &&
        mapperTypeName !== "Dictionary" &&
        (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            mapperTypeName?.match(/^(Date|DateTime|DateTimeRfc1123|UnixTime|ByteArray|Base64Url)$/i) !==
                null ||
            value === undefined ||
            value === null));
}
const validateISODuration = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
/**
 * Returns true if the given string is in ISO 8601 format.
 * @param value - The value to be validated for ISO 8601 duration format.
 * @internal
 */
function isDuration(value) {
    return validateISODuration.test(value);
}
const validUuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
/**
 * Returns true if the provided uuid is valid.
 *
 * @param uuid - The uuid that needs to be validated.
 *
 * @internal
 */
function isValidUuid(uuid) {
    return validUuidRegex.test(uuid);
}
/**
 * Maps the response as follows:
 * - wraps the response body if needed (typically if its type is primitive).
 * - returns null if the combination of the headers and the body is empty.
 * - otherwise, returns the combination of the headers and the body.
 *
 * @param responseObject - a representation of the parsed response
 * @returns the response that will be returned to the user which can be null and/or wrapped
 *
 * @internal
 */
function handleNullableResponseAndWrappableBody(responseObject) {
    const combinedHeadersAndBody = {
        ...responseObject.headers,
        ...responseObject.body,
    };
    if (responseObject.hasNullableType &&
        Object.getOwnPropertyNames(combinedHeadersAndBody).length === 0) {
        return responseObject.shouldWrapBody ? { body: null } : null;
    }
    else {
        return responseObject.shouldWrapBody
            ? {
                ...responseObject.headers,
                body: responseObject.body,
            }
            : combinedHeadersAndBody;
    }
}
/**
 * Take a `FullOperationResponse` and turn it into a flat
 * response object to hand back to the consumer.
 * @param fullResponse - The processed response from the operation request
 * @param responseSpec - The response map from the OperationSpec
 *
 * @internal
 */
function flattenResponse(fullResponse, responseSpec) {
    const parsedHeaders = fullResponse.parsedHeaders;
    // head methods never have a body, but we return a boolean set to body property
    // to indicate presence/absence of the resource
    if (fullResponse.request.method === "HEAD") {
        return {
            ...parsedHeaders,
            body: fullResponse.parsedBody,
        };
    }
    const bodyMapper = responseSpec && responseSpec.bodyMapper;
    const isNullable = Boolean(bodyMapper?.nullable);
    const expectedBodyTypeName = bodyMapper?.type.name;
    /** If the body is asked for, we look at the expected body type to handle it */
    if (expectedBodyTypeName === "Stream") {
        return {
            ...parsedHeaders,
            blobBody: fullResponse.blobBody,
            readableStreamBody: fullResponse.readableStreamBody,
        };
    }
    const modelProperties = (expectedBodyTypeName === "Composite" &&
        bodyMapper.type.modelProperties) ||
        {};
    const isPageableResponse = Object.keys(modelProperties).some((k) => modelProperties[k].serializedName === "");
    if (expectedBodyTypeName === "Sequence" || isPageableResponse) {
        const arrayResponse = fullResponse.parsedBody ?? [];
        for (const key of Object.keys(modelProperties)) {
            if (modelProperties[key].serializedName) {
                arrayResponse[key] = fullResponse.parsedBody?.[key];
            }
        }
        if (parsedHeaders) {
            for (const key of Object.keys(parsedHeaders)) {
                arrayResponse[key] = parsedHeaders[key];
            }
        }
        return isNullable &&
            !fullResponse.parsedBody &&
            !parsedHeaders &&
            Object.getOwnPropertyNames(modelProperties).length === 0
            ? null
            : arrayResponse;
    }
    return handleNullableResponseAndWrappableBody({
        body: fullResponse.parsedBody,
        headers: parsedHeaders,
        hasNullableType: isNullable,
        shouldWrapBody: isPrimitiveBody(fullResponse.parsedBody, expectedBodyTypeName),
    });
}
//# sourceMappingURL=utils.js.map

/***/ }

};
;
//# sourceMappingURL=3.extension.js.map