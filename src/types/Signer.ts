export type Signer = (
    suite
  ) => {
    sign: ({ data }: { data: Uint8Array }) => Promise<Uint8Array>;
};