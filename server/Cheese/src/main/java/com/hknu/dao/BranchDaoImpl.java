package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Branch;

@Repository
public class BranchDaoImpl extends BaseDao<Branch> {
	@Autowired
	public BranchDaoImpl(DataSource dataSource) {
		super(dataSource, "branches", "branch_id");
	}
	
	@Override
	public Branch createObjectFromResultSet(ResultSet rs) throws SQLException {
		Branch branch = new Branch(
				rs.getInt("branch_id"),
				rs.getString("name"),
				rs.getFloat("latitude"),
				rs.getFloat("longitude"),
				rs.getInt("shooting_cost"),
				rs.getInt("printing_cost"),
				rs.getInt("paper_amount"));
		return branch;
	}
}