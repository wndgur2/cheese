package com.hknu.entity;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@RequiredArgsConstructor
public class Payment {
	private final int payment_id;
	private int customer_id;
	private final int branch_id;
	private final int cost;
	private final Date created_at;
	private final int amount;
	private final boolean photo_or_print;
}
