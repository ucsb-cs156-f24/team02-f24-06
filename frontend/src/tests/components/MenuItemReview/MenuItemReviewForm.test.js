import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByText(/Date/);
    await screen.findByText(/Reviewer Email/);
    await screen.findByText(/ItemID/);
    await screen.findByText(/Stars/);
    await screen.findByText(/Comments/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a MenuItemReview", async () => {
    render(
      <Router>
        <MenuItemReviewForm
          initialContents={menuItemReviewFixtures.oneMenuItem}
        />
      </Router>,
    );
    await screen.findByTestId(/MenuItemReviewForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-dateReviewed");
    // const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-dateReviewed",
    );
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(dateReviewedField, { target: { value: "bad-input" } });
    // fireEvent.change(localDateTimeField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/dateReviewed is required./);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-submit");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/dateReviewed is required./);
    expect(screen.getByText(/reviewerEmail is required./)).toBeInTheDocument();
    expect(screen.getByText(/itemID is required./)).toBeInTheDocument();
    expect(screen.getByText(/stars are required./)).toBeInTheDocument();
    expect(screen.getByText(/comments are required./)).toBeInTheDocument();
  });

  test("No error messages on valid input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <MenuItemReviewForm submitAction={mockSubmitAction} />
      </Router>,
    );

    await screen.findByTestId("MenuItemReviewForm-dateReviewed");

    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-dateReviewed",
    );
    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const itemIDField = screen.getByTestId("MenuItemReview-itemID");
    const starsField = screen.getByTestId("MenuItemReview-stars");
    const commentsField = screen.getByTestId("MenuItemReview-comments");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(dateReviewedField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(reviewerEmailField, {
      target: { value: "test@example.com" },
    });
    fireEvent.change(itemIDField, { target: { value: "12345" } });
    fireEvent.change(starsField, { target: { value: "5" } });
    fireEvent.change(commentsField, { target: { value: "Great product!" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/dateReviewed is required/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/reviewerEmail is required/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/itemID is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/stars are required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/comments are required/)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-cancel");
    const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
