# 菜单2

## 功能介绍

菜单2主要提供以下能力：

### 核心特性

- 特性 A：支持批量操作
- 特性 B：提供实时监控面板
- 特性 C：支持自定义扩展

### 使用示例

```java
public class Menu2Demo {
    public static void main(String[] args) {
        System.out.println("Hello from 菜单2");
    }
}
```

### API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/query | GET | 查询数据 |
| /api/create | POST | 创建数据 |
| /api/update | PUT | 更新数据 |
| /api/delete | DELETE | 删除数据 |

### 最佳实践

1. 合理设置缓存策略
2. 做好异常兜底处理
3. 定期检查日志和监控指标