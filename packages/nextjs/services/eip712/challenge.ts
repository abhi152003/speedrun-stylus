import { EIP_712_DOMAIN, isValidEip712Signature } from "./common";

export const EIP_712_TYPED_DATA__CHALLENGE_SUBMIT = {
  domain: EIP_712_DOMAIN,
  types: {
    Message: [
      { name: "action", type: "string" },
      { name: "challengeId", type: "string" },
      { name: "frontendUrl", type: "string" }, // Keep it in the type
      { name: "githubRepoUrl", type: "string" },
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
};

export const isValidEIP712ChallengeSubmitSignature = async ({
  address,
  signature,
  challengeId,
  frontendUrl,
  githubRepoUrl,
}: IsValidSignatureParams) => {
  // Construct the message object, conditionally adding frontendUrl
  const message: { [key: string]: string } = {
    ...EIP_712_TYPED_DATA__CHALLENGE_SUBMIT.message,
    challengeId,
    githubRepoUrl,
    frontendUrl: frontendUrl || "", // Include frontendUrl, use empty string if null/undefined
  };

  const typedData = {
    ...EIP_712_TYPED_DATA__CHALLENGE_SUBMIT,
    message,
    signature,
  };

  // isValidEip712Signature expects the full structure based on types
  return await isValidEip712Signature({ typedData, address });
};
