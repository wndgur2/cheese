package com.hknu.entity;

import java.sql.Timestamp;

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
	private final Integer payment_id;
	private Integer customer_id;
	private final Integer branch_id;
	private final Integer cost;
	private final Timestamp created_at;
	private final Integer amount;
	private final boolean photo_or_print;
}
