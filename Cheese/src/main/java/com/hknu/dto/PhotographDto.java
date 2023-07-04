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
public class PhotographDto {
	private int photographId;
	private int customerId;
	private BranchDto branch;
	private Date createdAt;
	private Date shootedAt;
	private byte[] photoImage;
}
