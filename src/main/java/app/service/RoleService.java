package app.service;

import app.model.Role;

import java.util.List;

public interface RoleService {
    List<Role> getRoles();
    Role getRoleById(Long id);
}
