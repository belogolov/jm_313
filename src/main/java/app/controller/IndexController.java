package app.controller;

import app.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;


@Controller
public class IndexController {
    private final RoleService roleService;

    @Autowired
    public IndexController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping(value = {"/admin", "/user"})
    public String indexAdmin(ModelMap model) {
        model.addAttribute("allRoles", roleService.getRoles());
        return "mainPage";
    }

}
