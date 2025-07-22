import { EIP_712_DOMAIN, isValidEip712Signature } from "./common";

export const EIP_712_TYPED_DATA__CHALLENGE_SUBMIT = {
  domain: EIP_712_DOMAIN,
  types: {
    Message: [
      { name: "action", type: "string" },
      { name: "challengeId", type: "string" },
      { name: "frontendUrl", type: "string" }, // Keep it in the type
      { name: "githubRepoUrl", type: "string" },
      { name: "deployedContractAddress", type: "string" },
      { name: "timeDifference", type: "string" },
      { name: "gasDifference", type: "string" },
    ],
  },
  primaryType: "Message",
  message: {
    // TODO: Maybe have beter message?
    action: "Submit Challenge",
  },
} as const;

// Define the parameters type, making frontendUrl optional
type IsValidSignatureParams = {
  address: string;
  signature: `0x${string}`;
  challengeId: string;
  frontendUrl?: string | null; // Optional
  githubRepoUrl: string;
  deployedContractAddress?: string | null; // Optional
  timeDifference?: string | null; // Optional
  gasDifference?: string | null; // Optional
};

export const isValidEIP712ChallengeSubmitSignature = async ({
  address,
  signature,
  challengeId,
  frontendUrl,
  githubRepoUrl,
  deployedContractAddress,
  timeDifference,
  gasDifference,
}: IsValidSignatureParams) => {
  // Construct the message object, conditionally adding optional fields
  const message: { [key: string]: string } = {
    ...EIP_712_TYPED_DATA__CHALLENGE_SUBMIT.message,
    challengeId,
    githubRepoUrl,
    frontendUrl: frontendUrl || "", // Include frontendUrl, use empty string if null/undefined
    deployedContractAddress: deployedContractAddress || "", // Include deployedContractAddress, use empty string if null/undefined
    timeDifference: timeDifference || "", // Include timeDifference, use empty string if null/undefined
    gasDifference: gasDifference || "", // Include gasDifference, use empty string if null/undefined
  };

  const typedData = {
    ...EIP_712_TYPED_DATA__CHALLENGE_SUBMIT,
    message,
    signature,
  };

  // isValidEip712Signature expects the full structure based on types
  return await isValidEip712Signature({ typedData, address });
};
