package com.hknu.entity;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class Share {
	private final Integer share_id;
	private final Integer customer_id;
	private final Integer branch_id;
	private final Timestamp created_at;
}
