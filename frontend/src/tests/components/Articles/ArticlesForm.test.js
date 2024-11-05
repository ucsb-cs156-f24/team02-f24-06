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

  const renderComponent = (ui) =>
    render(
      <QueryClientProvider client={queryClient}>
        <Router>{ui}</Router>
      </QueryClientProvider>,
    );

  beforeEach(() => {
    mockedNavigate.mockReset();
  });

  test("renders correctly with no initialContents", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);
    expect(await screen.findByText(/Title/)).toBeInTheDocument();
    expect(screen.getByTestId("ArticlesForm-submit")).toHaveTextContent(
      "Create",
    );
  });

  test("renders correctly when passing in initialContents", async () => {
    const initialArticle = articlesFixtures.oneArticle;
    renderComponent(
      <ArticlesForm
        initialContents={initialArticle}
        submitAction={jest.fn()}
      />,
    );

    expect(await screen.findByTestId("ArticlesForm-id")).toBeInTheDocument();
    expect(screen.getByLabelText(/Id/)).toHaveValue(
      initialArticle.id.toString(),
    );
    expect(screen.getByLabelText(/Title/)).toHaveValue(initialArticle.title);
    expect(screen.getByLabelText(/URL/)).toHaveValue(initialArticle.url);
    expect(screen.getByLabelText(/Explanation/)).toHaveValue(
      initialArticle.explanation,
    );
    expect(screen.getByLabelText(/Email/)).toHaveValue(initialArticle.email);

    expect(screen.getByLabelText(/Date Added/)).toBeInTheDocument();
  });

  test("Correct error messages on bad input", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);

    const urlField = await screen.findByTestId("ArticlesForm-url");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(urlField, { target: { value: "invalid-url" } });
    fireEvent.change(emailField, { target: { value: "valid@example.com" } });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/URL must be valid\./)).toBeInTheDocument();
    expect(screen.queryByText(/Email must be valid\./)).not.toBeInTheDocument();

    fireEvent.change(urlField, { target: { value: "https://validurl.com" } });
    fireEvent.change(emailField, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Email must be valid\./),
    ).toBeInTheDocument();
    expect(screen.queryByText(/URL must be valid\./)).not.toBeInTheDocument();
  });

  test("Correct error messages on missing input", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);

    const submitButton = screen.getByTestId("ArticlesForm-submit");
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Title is required\./)).toBeInTheDocument();
    expect(await screen.findByText(/URL is required\./)).toBeInTheDocument();
    expect(
      await screen.findByText(/Explanation is required\./),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Email is required\./)).toBeInTheDocument();
    expect(
      await screen.findByText(/Date added is required\./),
    ).toBeInTheDocument();
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();
    renderComponent(<ArticlesForm submitAction={mockSubmitAction} />);

    const titleField = await screen.findByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Sample Article" } });
    fireEvent.change(urlField, { target: { value: "http://example.com" } });
    fireEvent.change(explanationField, {
      target: { value: "Sample explanation" },
    });
    fireEvent.change(emailField, { target: { value: "test@example.com" } });

    // Provide a valid date without seconds to match datetime-local input
    fireEvent.change(dateAddedField, { target: { value: "2024-01-01T12:00" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Title is required\./)).not.toBeInTheDocument();
    expect(screen.queryByText(/URL is required\./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Explanation is required\./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Email is required\./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date added is required\./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/URL must be valid\./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Email must be valid\./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);
    const cancelButton = await screen.findByTestId("ArticlesForm-cancel");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("Max length validation works correctly for Title", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);

    const titleField = await screen.findByTestId("ArticlesForm-title");
    fireEvent.change(titleField, { target: { value: "a".repeat(256) } });
    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    expect(
      await screen.findByText(/Max length 255 characters\./),
    ).toBeInTheDocument();
  });

  test("Max length validation works correctly for URL", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);

    const urlField = await screen.findByTestId("ArticlesForm-url");
    fireEvent.change(urlField, { target: { value: "a".repeat(256) } });
    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    expect(
      await screen.findByText(/Max length 255 characters\./),
    ).toBeInTheDocument();
  });

  test("Max length validation works correctly for Explanation", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);

    const explanationField = await screen.findByTestId(
      "ArticlesForm-explanation",
    );
    fireEvent.change(explanationField, { target: { value: "a".repeat(256) } });
    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    expect(
      await screen.findByText(/Max length 255 characters\./),
    ).toBeInTheDocument();
  });

  test("Max length validation works correctly for Email", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);

    const emailField = await screen.findByTestId("ArticlesForm-email");
    fireEvent.change(emailField, {
      target: { value: "a".repeat(250) + "@example.com" },
    }); // Total >255
    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    expect(
      await screen.findByText(/Max length 255 characters\./),
    ).toBeInTheDocument();
  });

  test("URL pattern validation handles edge cases correctly", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);

    const urlField = await screen.findByTestId("ArticlesForm-url");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    // Missing protocol
    fireEvent.change(urlField, { target: { value: "www.example.com" } });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/URL must be valid\./)).toBeInTheDocument();

    // Invalid characters
    fireEvent.change(urlField, { target: { value: "http://exa mple.com" } });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/URL must be valid\./)).toBeInTheDocument();
  });

  test("Email pattern validation handles edge cases correctly", async () => {
    renderComponent(<ArticlesForm submitAction={jest.fn()} />);

    const emailField = screen.getByTestId("ArticlesForm-email");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    // Missing '@'
    fireEvent.change(emailField, { target: { value: "userexample.com" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Email must be valid\./),
    ).toBeInTheDocument();

    // Missing domain
    fireEvent.change(emailField, { target: { value: "user@" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Email must be valid\./),
    ).toBeInTheDocument();
  });
});
