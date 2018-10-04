export class PurchaseOrder {

id: number;
bidNumber: string;
bidType: string;
poIssueDate: Date;
dateReported: Date;
dealerFlag: string;
agencyFlag: string;
cityAgency: string;
dealerName: string;
spec: string;
vehicleType: string;
qty: number;
poNumber: string;
poComplete: string;
poAmount: string;
actualPo: string;
poDifference: number;
poReportedBy: string;

adminFeeDue: number;
amtRec: number;
payCd: string;
dateReceived: Date;
checkNumOne: string;
paymentTwo: number;
checkNumTwo: string;
checkDateTwo: Date;
paymentThree: number;
checkNumThree: string;
checkDateThree: string;
paymentFour: number;
checkNumFour: string;
checkDateFour: string;
paymentFive: number;
checkNumFive: string;
checkDateFive: Date;
fsaRefundAmt: number;
fsaRefundCheckNum: string;
fsaRefundDate: string;
correction: String;
auditDiff: number;
lateFeeAmt: number;
lateFeeCheckNum: string;
lateFeeCheckDate: string;
facAllocation25: number;
facAllocation50: number;
facAllocation20: number;
ffcaAllocation40: number;
ffcaAllocation50: number;
fsaAllocation: number;
totalAllocation: number;
estimatedDelivery: Date;
comments: string;
updatedBy: string;
createdBy: string;
createdTime: Date;
updatedTime: Date;
}