package com.hknu.controller;

import java.util.List;
import java.util.Map;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.dto.BranchDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.BranchServiceImpl;

@RestController
public class BranchController {
	@Autowired
	private BranchServiceImpl branchServiceImpl;
	
	// 지점 데이터 가져오기
	@GetMapping(value = "/branch/{branchId}")
	public ResponseEntity<ResponseDto<BranchDto>> getBranchById(@PathVariable Integer branchId) {
		return this.branchServiceImpl.getBranchById(branchId);
	}
	
	// 모든 지점 데이터 가져오기
	@GetMapping(value = "/branch")
	public ResponseEntity<ResponseDto<List<BranchDto>>> getAllBranchs() {
		return this.branchServiceImpl.getAllBranchs();
	}
	
	// 지점 추가하기
	@PostMapping(value = "/branch")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> insertBranch(
			@RequestParam String name, 
			@RequestParam float latitude, 
			@RequestParam float longitude, 
			@RequestParam(required = false) Integer shooting_cost, 
			@RequestParam(required = false) Integer printing_cost,
			@RequestParam Integer paper_amount,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.branchServiceImpl.insertBranch(name, latitude, longitude, shooting_cost, printing_cost, paper_amount, accessToken, refreshToken);
	}
	
	// 지점 수정하기
	@PutMapping(value = "/branch/{branchId}")
	public ResponseEntity<ResponseDto<NullType>> updateBranch(
			@PathVariable Integer branchId, 
			@RequestParam String name, 
			@RequestParam float latitude, 
			@RequestParam float longitude,
			@RequestParam(required = false) Integer shooting_cost,
			@RequestParam(required = false) Integer printing_cost,
			@RequestParam(required = false) Integer paper_amount,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.branchServiceImpl.updateBranch(branchId, name, latitude, longitude, shooting_cost, printing_cost, paper_amount, accessToken, refreshToken);
	}
	
	// 지점 삭제하기
	@DeleteMapping(value = "/branch/{branchId}")
	public ResponseEntity<ResponseDto<NullType>> deleteBranch(
			@PathVariable Integer branchId,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.branchServiceImpl.deleteBranch(branchId, accessToken, refreshToken);
	}
	
	// 카메라 대기열 조회하기
	@GetMapping(value = "/cameraQueue/{branchId}")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> checkCameraClients(
			@PathVariable Integer branchId, 
			@RequestParam(required = false) String device) {
		return this.branchServiceImpl.checkCameraClients(branchId, device);
	}

	// 인화기 대기열 조회하기
	@GetMapping(value = "/printerQueue/{branchId}")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> checkPrinterClients(
			@PathVariable Integer branchId,
			@RequestParam(required = false) String device) {
		return this.branchServiceImpl.checkPrinterClients(branchId, device);
	}
	
//	// 카메라 대기열 추가하기
//	@PostMapping(value = "/cameraQueue/{branchId}")
//	public ResponseEntity<ResponseDto<Map<String, Integer>>> enCameraQueue(
//			@PathVariable Integer branchId, 
//			@RequestParam String device) {
//		return this.branchServiceImpl.enCameraQueue(branchId, device);
//	}
	
//	// 카메라 대기열 취소하기
//	@DeleteMapping(value = "/cameraQueue/{branchId}")
//	public ResponseEntity<ResponseDto<NullType>> deCameraQueue(
//			@PathVariable Integer branchId, 
//			@RequestParam String device) {
//		return this.branchServiceImpl.deCameraQueue(branchId, device);
//	}
	
//	// 인화기 대기열 추가하기
//	@PostMapping(value = "/printerQueue/{branchId}")
//	public ResponseEntity<ResponseDto<Map<String, Integer>>> enPrinterQueue(
//			@PathVariable Integer branchId, 
//			@RequestParam String device) {
//		return this.branchServiceImpl.enPrinterQueue(branchId, device);
//	}
//	
//	// 인화기 대기열 취소하기
//	@DeleteMapping(value = "/printerQueue/{branchId}")
//	public ResponseEntity<ResponseDto<NullType>> dePrinterQueue(
//			@PathVariable Integer branchId, 
//			@RequestParam String device) {
//		return this.branchServiceImpl.dePrinterQueue(branchId, device);
//	}
}
