package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
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
		long koreaTimeMillis = rs.getTimestamp("created_at").getTime() - (9 * 60 * 60 * 1000);
		Timestamp koreaTimestamp = new Timestamp(koreaTimeMillis);
		Timelapse timelapse = new Timelapse(
				rs.getInt("timelapse_id"),
				rs.getInt("customer_id"),
				rs.getInt("branch_id"),
				koreaTimestamp,
				rs.getBytes("video"));
		return timelapse;
	}
	
	public List<Timelapse> getListByCustomerId(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE customer_id=?;", tableName);

		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<Timelapse>>() { 
			public List<Timelapse> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<Timelapse> objectList = new ArrayList<>();
					Timelapse firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						Timelapse object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;
				}
				return null;
			}
		}, id);
	}
}