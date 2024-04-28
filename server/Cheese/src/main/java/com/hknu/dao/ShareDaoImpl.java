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

import com.hknu.entity.Share;

@Repository
public class ShareDaoImpl extends BaseDao<Share> {
	@Autowired
	public ShareDaoImpl(DataSource dataSource) {
		super(dataSource, "share", "share_id");
	}
	
	@Override
	public Share createObjectFromResultSet(ResultSet rs) throws SQLException {
		long koreaTimeMillis = rs.getTimestamp("created_at").getTime() - (9 * 60 * 60 * 1000);
		Timestamp koreaTimestamp = new Timestamp(koreaTimeMillis);
		Share share = new Share(
				rs.getInt("share_id"),
				rs.getInt("customer_id"),
				rs.getInt("branch_id"),
				koreaTimestamp);
		return share;
	}
	
	public List<Share> getListByCustomerId(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE customer_id=?;", tableName);

		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<Share>>() { 
			public List<Share> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<Share> objectList = new ArrayList<>();
					Share firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						Share object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;
				}
				return null;
			}
		}, id);
	}
	
	public List<Share> getListByBranchIdAndIndex(Integer index, Integer id) {
		String sql = String.format("SELECT * FROM %s ", tableName);
		
		if (id != null) {
			sql += String.format("WHERE branch_id=%s ", id);
		}
		
		sql += String.format("ORDER BY %s DESC LIMIT %s, %s;", tableId, (index - 1) * 10, 10);
		System.out.println(sql);
		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<Share>>() { 
			public List<Share> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<Share> objectList = new ArrayList<>();
					Share firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						Share object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;
				}
				return null;
			}
		});
	}
}
