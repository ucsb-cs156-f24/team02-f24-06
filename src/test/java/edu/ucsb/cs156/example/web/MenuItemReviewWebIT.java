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

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_menu_item_review() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Review").click();

        page.getByText("Create MenuItemReview").click();
        assertThat(page.getByText("Create New MenuItemReview")).isVisible();
        // page.getByTestId("RestaurantForm-name").fill("Freebirds");
        // page.getByTestId("RestaurantForm-description").fill("Build your own burrito chain");
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("test@gmail.com");
        page.getByTestId("MenuItemReview-itemID").fill("10");
        page.getByTestId("MenuItemReview-stars").fill("5");
        page.getByTestId("MenuItemReview-comments").fill("comments");
        page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2020-03-02T05:15");

        page.getByTestId("MenuItemReviewForm-submit").click();


        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments"))
                .hasText("comments");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
        page.getByTestId("MenuItemReview-itemID").fill("10");
        assertThat(page.getByText("Edit MenuItemReview")).isVisible();
        page.getByTestId("MenuItemReview-comments").fill("comment2");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("comment2");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-name")).not().isVisible();
    }

}