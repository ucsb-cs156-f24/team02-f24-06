import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  const queryClient = new QueryClient();

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>
    );
    await screen.findByText(/Title/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm initialContents={articlesFixtures.oneArticle} />
        </Router>
      </QueryClientProvider>
    );
    await screen.findByTestId("ArticlesForm-id");
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId("ArticlesForm-id")).toHaveValue("1");
  });

  test("Correct error messages on bad input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>
    );
    await screen.findByTestId("ArticlesForm-url");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(urlField, { target: { value: "invalid-url" } });
    fireEvent.change(emailField, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    await screen.findByText(/URL must be valid/);
    await screen.findByText(/Email must be valid/);
  });

  test("Correct error messages on missing input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>
    );
    const submitButton = screen.getByTestId("ArticlesForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/Title is required/);
    await screen.findByText(/URL is required/);
    await screen.findByText(/Explanation is required/);
    await screen.findByText(/Email is required/);
    await screen.findByText(/Date added is required/);
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm submitAction={mockSubmitAction} />
        </Router>
      </QueryClientProvider>
    );

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Sample Article" } });
    fireEvent.change(urlField, { target: { value: "http://example.com" } });
    fireEvent.change(explanationField, { target: { value: "Sample explanation" } });
    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(dateAddedField, { target: { value: "2022-01-01T12:00" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Title is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/URL is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Explanation is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Email is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Date added is required/)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>
    );
    const cancelButton = screen.getByTestId("ArticlesForm-cancel");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
