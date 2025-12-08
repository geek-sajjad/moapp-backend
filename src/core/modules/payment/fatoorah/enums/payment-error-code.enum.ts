export enum PaymentErrorCodeEnum {
  // 3DS authentication failed, possible reasons (user inserted a wrong password, cardholder/card issuer are not enrolled with 3DS, or the issuer bank has technical issue).
  MF001 = 'MF001',

  // The issuer bank has declined the transaction, possible reasons (invalid card details, insufficient funds, denied by risk, the card is expired/held, or card is not enabled for online purchase).
  MF002 = 'MF002',

  // The transaction has been blocked from the gateway, possible reasons (unsupported card BIN, fraud detection, or security blocking rules).
  MF003 = 'MF003',

  // Insufficient funds
  MF004 = 'MF004',

  // Session timeout
  MF005 = 'MF005',

  // Transaction canceled
  MF006 = 'MF006',

  // The card is expired.
  MF007 = 'MF007',

  // The card issuer doesn't respond.
  MF008 = 'MF008',

  // Denied by Risk
  MF009 = 'MF009',

  // Wrong Security Code
  MF010 = 'MF010',

  // Unspecified Failure
  MF020 = 'MF020',
}
