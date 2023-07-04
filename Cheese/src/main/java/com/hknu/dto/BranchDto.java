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
	private int branchId;
	private int address;
	private int shootingCost;
	private int printingCost;
	private int paperAmount;
	private List<FrameDto> frames;
	private List<StickerDto> stickers;
	private List<FilterDto> filters;
}
