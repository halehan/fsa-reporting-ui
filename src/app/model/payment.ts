export class Payment {

    id: number;
    fsaReportId: number;
    paymentDate: Date;
    paymentAmount: number;
    paymentNumber: number;
    paymentCheckNum: number;
    correction: number;
    auditDifference: number;
    lateFeeAmt: number;
    lateFeeCheckNum: number;
    lateFeeCheckDate: Date;
    fsaRefundAmount: number;
    fsaRefundCheckNum: number;
    fsaRefundDate: Date;
    fsaAlloc: number;
    facAlloc: number;
    ffcaAlloc: number;
    totalAlloc: number;
    comment: string;
    updatedBy: string;
    updatedDate: string;
    createdBy: string;
    createdDate: Date;

}
