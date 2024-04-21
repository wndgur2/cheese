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
	private final Integer branch_id;
	private final String name;
	private final float latitude;
	private final float longitude;
	private Integer shooting_cost;
	private Integer printing_cost;
	private final int paper_amount;
}
