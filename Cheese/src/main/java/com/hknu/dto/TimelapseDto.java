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
public class TimelapseDto {
	private int timelapseId;
	private int customerId;
	private BranchDto branch;
	private Date createdAt;
	private byte[] video;
}
