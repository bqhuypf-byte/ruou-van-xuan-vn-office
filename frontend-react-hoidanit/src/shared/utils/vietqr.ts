export interface VietQrParams {
  bankBin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  content: string;
}

export const buildVietQrImageUrl = ({
  bankBin,
  accountNumber,
  accountName,
  amount,
  content,
}: VietQrParams): string => {
  const params = new URLSearchParams({
    amount: String(Math.round(amount)),
    addInfo: content,
    accountName,
  });
  return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?${params.toString()}`;
};
