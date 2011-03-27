class Tower < ActiveRecord::Base
  def to_json
    self.attributes.to_json
  end

  def map
    @towers=Tower.find_all_by_state 'HI'
  end

end
