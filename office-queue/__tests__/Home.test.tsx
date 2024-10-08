import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

it("should have docs", () => {
  render(<Home />);

  const myElem = screen.getByText("Learn");

  expect(myElem).toBeInTheDocument();
});
