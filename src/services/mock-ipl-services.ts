export const mockIplService = {
  getPaymentStatus: (noRumah: string, month: string) => {
    return `
      NoRumah: ${noRumah}
      month: ${month}
      Status: pending
      Note: Payment is still pending and has not been verified by the pengurus yet.
    `;
  },
  submitPayment: (noRumah: string, month: string) => {
    return `
      NoRumah: ${noRumah}
      month: ${month}
      Status: submitted
      Note: Payment has been submitted successfully and is awaiting confirmation from the pengurus.
    `;
  },
  summarizeIPL: (noRumah: string) => {
    return `
      NoRumah: ${noRumah}
      jumlah pembayaran: 1500000, tersisa 3 bulan yg belum dibayar sampai akhir tahun
    `;
  },
};