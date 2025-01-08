package com.example.backend.util;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Sort;

public class QueryDslUtil {
  public static OrderSpecifier<?>[] getOrderSpecifier(Sort sort, PathBuilder<?> entityPath) {
    List<OrderSpecifier<?>> orders = new ArrayList<>();
    sort.forEach(order -> {
      OrderSpecifier<?> orderSpecifier = new OrderSpecifier(
          order.isAscending() ? com.querydsl.core.types.Order.ASC : com.querydsl.core.types.Order.DESC,
          entityPath.get(order.getProperty())
      );
      orders.add(orderSpecifier);
    });
    return orders.toArray(new OrderSpecifier[0]);
  }
}
