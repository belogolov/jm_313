package app.controller;

import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;


@Controller
public class IndexController {
    private final UserService userService;

    @Autowired
    public IndexController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public String indexAdmin(ModelMap model) {
        model.addAttribute("allRoles", userService.getRoles());
        return "mainPage";
    }

    @GetMapping("/user")
    public String indexUser(ModelMap model) {
        model.addAttribute("allRoles", userService.getRoles());
        return "mainPage";
    }

}
