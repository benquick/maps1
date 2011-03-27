class ChapFourController < ApplicationController
  def map
    @stores = Store.find :all
  end
end
