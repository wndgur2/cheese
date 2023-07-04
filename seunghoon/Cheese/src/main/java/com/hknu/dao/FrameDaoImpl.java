package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Frame;

@Repository
public class FrameDaoImpl extends BaseDao<Frame> {
	@Autowired
	public FrameDaoImpl(DataSource dataSource) {
		super(dataSource, "Frames", "frame_id");
	}
	
	@Override
	public Frame createObjectFromResultSet(ResultSet rs) throws SQLException {
		Frame frame = new Frame(
				rs.getInt("frame_id"),
				rs.getInt("branch_id"),
				rs.getBytes("frame_image"));
		return frame;
	}
}