package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
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
	
	public List<Frame> getListByBranchId(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE branch_id", tableName);
		
		if (id == null) {
			sql += " is null;";
		}
		else {
			sql += String.format("=%s;", id);
		}

		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<Frame>>() { 
			public List<Frame> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<Frame> objectList = new ArrayList<>();
					Frame firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						Frame object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;
				}
				return null;
			}
		});
	}
}