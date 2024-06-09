package com.example.backend.util;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class ApplicationContextProvider implements ApplicationContextAware {

  private static ApplicationContext context;

  public static <T> T bean(Class<T> beanType) {
    return context.getBean(beanType);
  }

  public static Object bean(String name) {
    return context.getBean(name);
  }

  @Override
  public void setApplicationContext(@SuppressWarnings("NullableProblems") ApplicationContext ac) {
    context = ac;
  }
}