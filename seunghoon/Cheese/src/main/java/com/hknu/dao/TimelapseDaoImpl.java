package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Timelapse;

@Repository
public class TimelapseDaoImpl extends BaseDao<Timelapse> {
	@Autowired
	public TimelapseDaoImpl(DataSource dataSource) {
		super(dataSource, "Timelapses", "timelapse_id");
	}
	
	@Override
	public Timelapse createObjectFromResultSet(ResultSet rs) throws SQLException {
		Timelapse timelapse = new Timelapse(
				rs.getInt("timelapse_id"),
				rs.getInt("customer_id"),
				rs.getInt("branch_id"),
				rs.getDate("created_at"),
				rs.getBytes("video"));
		return timelapse;
	}
}