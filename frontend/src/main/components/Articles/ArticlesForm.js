import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ArticlesForm({ initialContents, submitAction, buttonLabel = "Create" }) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="ArticlesForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Article Title</Form.Label>
            <Form.Control
              data-testid="ArticlesForm-title"
              id="title"
              type="text"
              isInvalid={Boolean(errors.title)}
              {...register("title", {
                required: "An article title is required.",
                maxLength: {
                  value: 255,
                  message: "Max length 255 characters.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="url">Article URL</Form.Label>
              <Form.Control
                data-testid="ArticlesForm-url"
                id="url"
                type="text"
                isInvalid={Boolean(errors.url)}
                {...register("url", {
                  required: "A URL is required.",
                  maxLength: {
                    value: 255,
                    message: "Max length 255 characters.",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.url?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="explanation">Article Explanation</Form.Label>
              <Form.Control
                data-testid="ArticlesForm-explanation"
                id="explanation"
                type="text"
                isInvalid={Boolean(errors.explanation)}
                {...register("explanation", {
                  required: "An explanation is required.",
                  maxLength: {
                    value: 255,
                    message: "Max length 255 characters.",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.explanation?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="dateAdded">Date Added (ISO format)</Form.Label>
              <Form.Control
                data-testid="ArticlesForm-dateAdded"
                id="dateAdded"
                type="datetime-local"
                isInvalid={Boolean(errors.dateAdded)}
                {...register("dateAdded", {
                  required: "A date is required.",
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dateAdded?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="ArticlesForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="ArticlesForm-cancel"
            className="ms-2"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ArticlesForm;
