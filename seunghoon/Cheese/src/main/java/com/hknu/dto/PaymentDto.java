package com.hknu.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class PaymentDto {
	private int paymentId;
	private BranchDto branch;
	private int cost;
	private Date createdAt;
	private int amount;
	private boolean photoOrPrint;
}
