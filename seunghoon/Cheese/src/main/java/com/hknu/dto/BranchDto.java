package com.hknu.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class BranchDto {
	private Integer branchId;
	private String name;
	private float latitude;
	private float longitude;
	private Integer shootingCost;
	private Integer printingCost;
	private Integer paperAmount;
	private List<FrameDto> frames;
	private List<StickerDto> stickers;
	private List<FilterDto> filters;
}
