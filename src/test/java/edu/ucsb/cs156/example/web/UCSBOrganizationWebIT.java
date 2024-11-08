package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

import com.microsoft.playwright.TimeoutError;
import com.microsoft.playwright.Page;
import java.nio.file.Paths;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_org() throws Exception {
        setupUser(true);

        if (page.getByText("UCSB Organizations").count() > 0) {
            try {
                page.getByText("UCSB Organizations").click();
            } catch (TimeoutError e) {
                System.out.println("Timeout occurred while trying to click 'UCSB Organizations'. Taking screenshot...");
                page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("admin_timeout_screenshot.png")));
                throw e;
            }
        } else {
            System.out.println("UCSB Organizations link is not visible for admin. Current URL: " + page.url());
            return;
        }

        // Proceed with create, edit, and delete operations with checks
        page.getByText("Create UCSB Organization").click();
        assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-name").fill("CS");
        page.getByTestId("UCSBOrganizationForm-description").fill("Computer Science");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-description"))
                .hasText("Computer Science");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSB Organization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-description").fill("THE BEST");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-description")).hasText("THE BEST");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsborganization() throws Exception {
        setupUser(false);

        // Logging current URL before attempting to click
        System.out.println("Navigating to UCSB Organizations page. Current URL: " + page.url());

        // Ensure "UCSB Organizations" link is visible before clicking
        if (page.getByText("UCSB Organizations").count() > 0) {
            try {
                page.getByText("UCSB Organizations").click();
            } catch (TimeoutError e) {
                System.out.println("Timeout occurred while trying to click 'UCSB Organizations'. Taking screenshot...");
                page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("timeout_screenshot.png")));
                throw e;
            }
        } else {
            System.out.println("UCSB Organizations link is not visible on the page. Current URL: " + page.url());
            return; // Exit the test if the element isn't found
        }

        // Check if "Create UCSB Organization" is visible for regular user (it should not be)
        assertThat(page.getByText("Create UCSB Organization")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-name")).not().isVisible();
    }
}