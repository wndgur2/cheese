package com.hknu.entity;

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
public class Branch {
	private final int branch_id;
	private final int address;
	private int shooting_cost;
	private int printing_cost;
	private final int paper_amount;
}
