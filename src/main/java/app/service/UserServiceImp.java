package app.service;

import app.model.Role;
import app.model.User;
import app.repository.RoleRepository;
import app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImp implements UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImp(UserRepository userRepo, RoleRepository roleRepo, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void add(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user == null || user.getRoles().size() == 0) {
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepo.findById(2L).get());
            user.setRoles(roles);
        }
        userRepo.save(user);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        userRepo.deleteById(id);
    }

    @Transactional
    @Override
    public void update(User user) {
        User dbUser = getUserById(user.getId());
        if (dbUser != null) {
            if (!user.getPassword().equals(dbUser.getPassword())) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
        }
        userRepo.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepo.findById(id).get();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public List<Role> getRoles() {
        return roleRepo.findAll();
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepo.findById(id).get();
    }
}
