import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    await screen.findByText(/Article Title/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in an Article", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFixtures.oneArticle} />
      </Router>
    );
    await screen.findByTestId(/ArticlesForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
  });

  test("Correct error messages on bad input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const dateField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "x".repeat(300) } });
    fireEvent.change(explanationField, { target: { value: "x".repeat(300) } });
    fireEvent.change(urlField, { target: { value: "" } });
    fireEvent.change(dateField, { target: { value: "" } });
    fireEvent.click(submitButton);

    const maxLengthErrors = await screen.findAllByText(/Max length 255 characters./);
    expect(maxLengthErrors).toHaveLength(2);
    expect(screen.getByText(/A URL is required./)).toBeInTheDocument();
    expect(screen.getByText(/A date is required./)).toBeInTheDocument();
  });

  test("Correct error messages on missing input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    await screen.findByTestId("ArticlesForm-submit");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/An article title is required./);
    expect(screen.getByText(/A URL is required./)).toBeInTheDocument();
    expect(screen.getByText(/An explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/A date is required./)).toBeInTheDocument();
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>
    );
    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Test Title" } });
    fireEvent.change(urlField, { target: { value: "https://example.com" } });
    fireEvent.change(explanationField, { target: { value: "Explanation text" } });
    fireEvent.change(dateAddedField, { target: { value: "2022-01-02T12:00:00" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Max length 255 characters./)).not.toBeInTheDocument();
    expect(screen.queryByText(/A URL is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/A date is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    await screen.findByTestId("ArticlesForm-cancel");
    const cancelButton = screen.getByTestId("ArticlesForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
