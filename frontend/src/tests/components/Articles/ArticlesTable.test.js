import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { articlesFixtures } from "fixtures/articlesFixtures";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "id",
      "Title",
      "URL",
      "Explanation",
      "Email",
      "dateAdded",
    ];
    const expectedFields = [
      "id",
      "title",
      "url",
      "explanation",
      "email",
      "dateAdded",
    ];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("Sample Article 1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-url`),
    ).toHaveTextContent("https://samplewebsite.com/article1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent("Explanation for sample article 1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-email`),
    ).toHaveTextContent("sample1@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`),
    ).toHaveTextContent("2022-04-20T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-title`),
    ).toHaveTextContent("Sample Article 2");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-url`),
    ).toHaveTextContent("https://samplewebsite.com/article2");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-explanation`),
    ).toHaveTextContent("Explanation for sample article 2");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-email`),
    ).toHaveTextContent("sample2@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`),
    ).toHaveTextContent("2022-04-19T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-title`),
    ).toHaveTextContent("Sample Article 3");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-url`),
    ).toHaveTextContent("https://samplewebsite.com/article3");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-explanation`),
    ).toHaveTextContent("Explanation for sample article 3");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-email`),
    ).toHaveTextContent("sample3@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateAdded`),
    ).toHaveTextContent("2022-04-20T12:00:00");

    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "id",
      "Title",
      "URL",
      "Explanation",
      "Email",
      "dateAdded",
    ];
    const expectedFields = [
      "id",
      "title",
      "url",
      "explanation",
      "email",
      "dateAdded",
    ];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("Sample Article 1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-url`),
    ).toHaveTextContent("https://samplewebsite.com/article1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent("Explanation for sample article 1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-email`),
    ).toHaveTextContent("sample1@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`),
    ).toHaveTextContent("2022-04-20T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-title`),
    ).toHaveTextContent("Sample Article 2");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-url`),
    ).toHaveTextContent("https://samplewebsite.com/article2");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-explanation`),
    ).toHaveTextContent("Explanation for sample article 2");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-email`),
    ).toHaveTextContent("sample2@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`),
    ).toHaveTextContent("2022-04-19T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-title`),
    ).toHaveTextContent("Sample Article 3");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-url`),
    ).toHaveTextContent("https://samplewebsite.com/article3");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-explanation`),
    ).toHaveTextContent("Explanation for sample article 3");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-email`),
    ).toHaveTextContent("sample3@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateAdded`),
    ).toHaveTextContent("2022-04-20T12:00:00");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const testId = "ArticlesTable";

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("Sample Article 1");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/articles/edit/1"),
    );
  });

  test("Delete button navigates to the delete page", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const testId = "ArticlesTable";

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("Sample Article 1");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
  });
});
