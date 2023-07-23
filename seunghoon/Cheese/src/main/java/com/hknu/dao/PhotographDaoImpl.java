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

import com.hknu.entity.Photograph;

@Repository
public class PhotographDaoImpl extends BaseDao<Photograph> {
	@Autowired
	public PhotographDaoImpl(DataSource dataSource) {
		super(dataSource, "Photographs", "photograph_id");
	}
	
	@Override
	public Photograph createObjectFromResultSet(ResultSet rs) throws SQLException {
		long koreaTimeMillis = rs.getTimestamp("created_at").getTime() - (9 * 60 * 60 * 1000);
		Timestamp koreaTimestamp = new Timestamp(koreaTimeMillis);
		Photograph photograph = new Photograph(
				rs.getInt("photograph_id"),
				rs.getInt("customer_id"),
				rs.getInt("branch_id"),
				koreaTimestamp,
				rs.getBytes("photo_image"));
		return photograph;
	}
	
	public Photograph getByPhotoImage(byte[] image) {
		String sql = String.format("SELECT * FROM %s WHERE photo_image=?;", tableName);

		return getJdbcTemplate().query(sql, new ResultSetExtractor<Photograph>() { 
			public Photograph extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					Photograph object = createObjectFromResultSet(rs);
					return object;
				}
				throw new NullPointerException("이미지가 존재하지 않습니다.");
			}
		}, image);
	}
	
	public List<Photograph> getListByCustomerId(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE customer_id=?;", tableName);

		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<Photograph>>() { 
			public List<Photograph> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<Photograph> objectList = new ArrayList<>();
					Photograph firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						Photograph object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;
				}
				return null;
			}
		}, id);
	}
}