package app.service;

import app.model.Role;
import app.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    List<Role> getRoles();

    User getUserById(Long id);
    Role getRoleById(Long id);

    User getUserByEmail(String email);

    void add(User user);

    void delete(Long id);

    void update(User user);

}
