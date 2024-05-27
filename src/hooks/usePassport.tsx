import { useRef } from "react";
import { WebauthnSigner } from "@0xpass/webauthn-signer";
import { Passport } from "@0xpass/passport";

interface PassportAuthProps {
  scope_id: string;
}

export function usePassport({
  scope_id,
}: PassportAuthProps): {
  passport: Passport;
  signer: WebauthnSigner;
} {
  const signerRef = useRef<WebauthnSigner | null>(null);
  const passportRef = useRef<Passport | null>(null);

  if (!signerRef.current) {
    signerRef.current = new WebauthnSigner({
      rpId: process.env.NEXT_PUBLIC_RP_ID!,
      rpName: "0xPass",
    });
  }

  if (!passportRef.current) {
    passportRef.current = new Passport({
      scopeId: scope_id,
      signer: signerRef.current,
    });
  }

  return {
    passport: passportRef.current,
    signer: signerRef.current,
  };
}