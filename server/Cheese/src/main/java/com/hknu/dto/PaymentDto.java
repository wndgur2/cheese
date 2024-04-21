package com.hknu.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class PaymentDto {
	private Integer paymentId;
	private Integer customerId;
	private Integer branchId;
	private Integer cost;
	private Timestamp createdAt;
	private Integer amount;
	private boolean photoOrPrint;
}
