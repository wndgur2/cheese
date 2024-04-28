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

import com.hknu.entity.Filter;

@Repository
public class FilterDaoImpl extends BaseDao<Filter> {
	@Autowired
	public FilterDaoImpl(DataSource dataSource) {
		super(dataSource, "filters", "filter_id");
	}
	
	@Override
	public Filter createObjectFromResultSet(ResultSet rs) throws SQLException {
		Filter filter = new Filter(
				rs.getInt("filter_id"),
				rs.getInt("branch_id"),
				rs.getInt("brightness"),
				rs.getInt("exposure"),
				rs.getInt("contrast"),
				rs.getInt("chroma"),
				rs.getInt("temperature"),
				rs.getInt("livliness"),
				rs.getInt("tint"),
				rs.getInt("tone"),
				rs.getInt("highlight"),
				rs.getInt("shadow"),
				rs.getInt("sharpness"),
				rs.getInt("grain"),
				rs.getInt("vineting"),
				rs.getInt("afterimage"),
				rs.getInt("dehaze"),
				rs.getInt("posterize"),
				rs.getInt("blur"),
				rs.getInt("mosaic"));
		return filter;
	}
	
	public List<Filter> getListByBranchId(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE branch_id", tableName);
		
		if (id == null) {
			sql += " is null;";
		}
		else {
			sql += String.format("=%s;", id);
		}

		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<Filter>>() { 
			public List<Filter> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if(rs.next()) {
					List<Filter> objectList = new ArrayList<>();
					Filter firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);
					
					while (rs.next()) {
						Filter object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;
				}
				return null;
			}
		});
	}
}